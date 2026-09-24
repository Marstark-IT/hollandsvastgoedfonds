<?php
// Shared CRM integration code: lead serialisation, API-key auth, rate limiting,
// signed webhook delivery with retries. Included by lead.php, t.php, stats.php
// and api/v1/*. Never executed directly (.htaccess denies _*.php).
declare(strict_types=1);

if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) { http_response_code(404); exit; }

const CRM_STATUSES = ['nieuw', 'gecontacteerd', 'bezichtiging', 'voorstel', 'gekocht', 'afgewezen'];
const CRM_BACKOFF = [60, 300, 900, 3600, 10800, 21600, 43200, 86400]; // seconds before attempt n+1
const CRM_TYPE_LABELS = ['woning' => 'Woning', 'portefeuille' => 'Meerdere woningen / portefeuille',
    'commercieel' => 'Kantoor, winkel of mixed-use', 'bedrijf' => 'Bedrijfshal of logistiek', 'anders' => 'Anders'];

function crm_data_dir(): string {
    return dirname(__DIR__, 4) . '/hollands_data';
}

function crm_config(): array {
    static $cfg = null;
    if ($cfg === null) {
        $f = crm_data_dir() . '/config.php';
        $cfg = is_file($f) ? (array)(include $f) : [];
    }
    return $cfg;
}

// Webhook endpoint settings are writable through the API, so they live in a
// separate JSON file instead of config.php.
function crm_settings(): array {
    $f = crm_data_dir() . '/crm.json';
    $d = is_file($f) ? json_decode((string)file_get_contents($f), true) : null;
    return is_array($d) ? $d : ['webhook_url' => ''];
}

function crm_save_settings(array $s): void {
    umask(0077);
    file_put_contents(crm_data_dir() . '/crm.json', json_encode($s, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);
}

function crm_db(): PDO {
    umask(0077);
    $db = new PDO('sqlite:' . crm_data_dir() . '/leads.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec('PRAGMA busy_timeout = 5000');
    crm_migrate($db);
    return $db;
}

// Additive, idempotent schema changes for the CRM sync.
function crm_migrate(PDO $db): void {
    $db->exec('CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, type TEXT, location TEXT,
        name TEXT, email TEXT, phone TEXT, message TEXT, locale TEXT, source TEXT, page TEXT,
        ip TEXT, user_agent TEXT, consent_at TEXT, submission_id TEXT UNIQUE)');
    $have = array_column($db->query('PRAGMA table_info(leads)')->fetchAll(PDO::FETCH_ASSOC), 'name');
    $want = ['status', 'updated_at', 'crm_id', 'webhook_status', 'webhook_attempts', 'webhook_next_at', 'webhook_last_error', 'webhook_delivered_at',
        'address', 'occupancy', 'units', 'condition', 'timeframe', 'price', 'contact_pref',
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'referrer', 'landing_page'];
    foreach ($want as $col) {
        if (!in_array($col, $have, true)) $db->exec("ALTER TABLE leads ADD COLUMN $col TEXT");
    }
}

function crm_now(): string {
    return gmdate('Y-m-d\TH:i:s\Z');
}

function crm_iso(?string $v): ?string {
    if (!$v) return null;
    $t = strtotime($v);
    return $t ? gmdate('Y-m-d\TH:i:s\Z', $t) : null;
}

// The one JSON shape every consumer sees (webhook payload and REST API).
function crm_lead(array $r): array {
    $n = fn($k) => ($r[$k] ?? '') === '' ? null : $r[$k];
    return [
        'id' => (int)$r['id'],
        'created_at' => crm_iso($r['created_at'] ?? null),
        'updated_at' => crm_iso($r['updated_at'] ?? null) ?? crm_iso($r['created_at'] ?? null),
        'status' => $r['status'] ?: 'nieuw',
        'crm_id' => $n('crm_id'),
        'property' => [
            'type' => $r['type'],
            'type_label' => CRM_TYPE_LABELS[$r['type']] ?? $r['type'],
            'location' => $n('location'),
            'address' => $n('address'),
            'occupancy' => $n('occupancy'),
            'units' => $n('units') === null ? null : (int)$r['units'],
            'condition' => $n('condition'),
            'timeframe' => $n('timeframe'),
            'price_indication' => $n('price'),
        ],
        'contact' => [
            'name' => $r['name'],
            'email' => $r['email'],
            'phone' => $r['phone'],
            'preferred_contact' => $n('contact_pref'),
            'language' => $r['locale'] ?: 'nl',
        ],
        'message' => $n('message'),
        'source' => [
            'form' => $n('source'),
            'page' => $n('page'),
            'landing_page' => $n('landing_page'),
            'referrer' => $n('referrer'),
            'utm_source' => $n('utm_source'),
            'utm_medium' => $n('utm_medium'),
            'utm_campaign' => $n('utm_campaign'),
            'utm_term' => $n('utm_term'),
            'utm_content' => $n('utm_content'),
            'gclid' => $n('gclid'),
            'gbraid' => $n('gbraid'),
            'wbraid' => $n('wbraid'),
            'fbclid' => $n('fbclid'),
            'msclkid' => $n('msclkid'),
        ],
        'consent' => ['given' => true, 'at' => crm_iso($r['consent_at'] ?? null)],
    ];
}

// ---------- REST API helpers ----------

function api_json(int $code, array $body): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

function api_error(int $code, string $error, string $message): void {
    api_json($code, ['error' => ['code' => $error, 'message' => $message]]);
}

// Bearer token (or X-API-Key) compared in constant time; 60 requests/minute.
function api_auth(): void {
    header_remove('X-Powered-By');
    $key = (string)(crm_config()['crm_api_key'] ?? '');
    $auth = (string)($_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    $given = stripos($auth, 'bearer ') === 0 ? trim(substr($auth, 7)) : (string)($_SERVER['HTTP_X_API_KEY'] ?? '');
    if ($key === '' || $given === '' || !hash_equals($key, $given)) {
        header('WWW-Authenticate: Bearer realm="hollandsvastgoedfonds-api"');
        api_error(401, 'unauthorized', 'Missing or invalid API key.');
    }
    $f = crm_data_dir() . '/api-rate.json';
    $win = (int)floor(time() / 60);
    $st = is_file($f) ? (json_decode((string)file_get_contents($f), true) ?: []) : [];
    $count = ($st['w'] ?? 0) === $win ? (int)($st['n'] ?? 0) + 1 : 1;
    @file_put_contents($f, json_encode(['w' => $win, 'n' => $count]), LOCK_EX);
    header('X-RateLimit-Limit: 60');
    header('X-RateLimit-Remaining: ' . max(0, 60 - $count));
    if ($count > 60) {
        header('Retry-After: ' . (60 - time() % 60));
        api_error(429, 'rate_limited', 'Too many requests. Limit is 60 per minute.');
    }
}

function api_body(): array {
    $d = json_decode((string)file_get_contents('php://input', false, null, 0, 20000), true);
    return is_array($d) ? $d : [];
}

// ---------- Webhooks ----------

// Refuse webhook targets that resolve to private, loopback or link-local
// addresses (SSRF protection); https only.
function crm_valid_webhook_url(string $url): ?string {
    $p = parse_url($url);
    if (!$p || ($p['scheme'] ?? '') !== 'https' || empty($p['host'])) return 'URL must start with https://';
    if (isset($p['user']) || isset($p['pass'])) return 'Credentials in the URL are not allowed.';
    $ips = @gethostbynamel($p['host']) ?: [];
    if (!$ips) return 'Host does not resolve.';
    foreach ($ips as $ip) {
        if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) return 'Host resolves to a private or reserved address.';
    }
    return null;
}

// Signature header: t=<unix time>,v1=<hex HMAC-SHA256 of "<t>.<raw body>">.
function crm_sign(string $body, int $ts): string {
    $secret = (string)(crm_config()['crm_webhook_secret'] ?? '');
    return 't=' . $ts . ',v1=' . hash_hmac('sha256', $ts . '.' . $body, $secret);
}

function crm_post(string $event, array $data, ?string $url = null): array {
    $url = $url ?? (string)(crm_settings()['webhook_url'] ?? '');
    if ($url === '') return [false, 'no webhook_url configured'];
    if ($why = crm_valid_webhook_url($url)) return [false, $why];
    $delivery = bin2hex(random_bytes(16));
    $body = json_encode(['event' => $event, 'delivery_id' => $delivery, 'sent_at' => crm_now(), 'data' => $data],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $ts = time();
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'User-Agent: HollandsVastgoedfonds-Webhooks/1.0',
            'X-HVF-Event: ' . $event,
            'X-HVF-Delivery: ' . $delivery,
            'X-HVF-Signature: ' . crm_sign($body, $ts),
        ],
    ]);
    $resp = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $cerr = curl_error($ch);
    curl_close($ch);
    if ($code >= 200 && $code < 300) return [true, "HTTP $code"];
    return [false, $cerr !== '' ? $cerr : "HTTP $code " . mb_substr((string)$resp, 0, 200)];
}

// Deliver one lead; on failure schedule the next attempt with backoff.
function crm_deliver(PDO $db, int $id): bool {
    $q = $db->prepare('SELECT * FROM leads WHERE id = ?');
    $q->execute([$id]);
    $r = $q->fetch(PDO::FETCH_ASSOC);
    if (!$r) return false;
    if (($r['webhook_status'] ?? '') === 'delivered') return true;
    $hasUrl = (string)(crm_settings()['webhook_url'] ?? '') !== '';
    if (!$hasUrl) {
        $db->prepare("UPDATE leads SET webhook_status = 'pending', webhook_last_error = 'no webhook_url configured' WHERE id = ?")->execute([$id]);
        return false;
    }
    [$ok, $info] = crm_post('lead.created', crm_lead($r));
    $attempts = (int)($r['webhook_attempts'] ?? 0) + 1;
    if ($ok) {
        $db->prepare("UPDATE leads SET webhook_status = 'delivered', webhook_attempts = ?, webhook_delivered_at = ?, webhook_last_error = NULL, webhook_next_at = NULL WHERE id = ?")
            ->execute([$attempts, crm_now(), $id]);
        return true;
    }
    $gave_up = $attempts > count(CRM_BACKOFF);
    $next = $gave_up ? null : gmdate('Y-m-d\TH:i:s\Z', time() + CRM_BACKOFF[$attempts - 1]);
    $db->prepare('UPDATE leads SET webhook_status = ?, webhook_attempts = ?, webhook_next_at = ?, webhook_last_error = ? WHERE id = ?')
        ->execute([$gave_up ? 'failed' : 'pending', $attempts, $next, mb_substr($info, 0, 300), $id]);
    return false;
}

// Retry due deliveries. Runs after the response of normal traffic (lead.php,
// t.php, API calls); a lock file keeps it to one run per minute.
function crm_retry_pending(int $max = 5): void {
    $lock = crm_data_dir() . '/crm-retry.lock';
    if (is_file($lock) && time() - (int)@filemtime($lock) < 60) return;
    @touch($lock);
    if ((string)(crm_settings()['webhook_url'] ?? '') === '') return;
    try {
        $db = crm_db();
        $q = $db->prepare("SELECT id FROM leads WHERE (webhook_status IS NULL OR webhook_status = 'pending')
            AND (webhook_next_at IS NULL OR webhook_next_at <= ?) ORDER BY id LIMIT ?");
        $q->execute([crm_now(), $max]);
        foreach ($q->fetchAll(PDO::FETCH_COLUMN) as $id) crm_deliver($db, (int)$id);
    } catch (Throwable $e) {
        error_log('[crm] retry: ' . $e->getMessage());
    }
}

// Send the HTTP response now and keep running (webhook work after the reply).
function crm_finish_response(): void {
    if (function_exists('litespeed_finish_request')) litespeed_finish_request();
    elseif (function_exists('fastcgi_finish_request')) fastcgi_finish_request();
}
