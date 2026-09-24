<?php
// Lead intake for the static site. Validates the form, stores each lead in
// SQLite outside the web root and emails a notification.
//
// Data dir: ~/hollands_data (4 levels above this file on Hostinger:
// ~/domains/<domain>/public_html/api). Optional ~/hollands_data/config.php
// returns ['notify_to' => ..., 'mail_from' => ..., 'export_key' => ...].

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

function out(int $code, array $body): void {
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') out(405, ['ok' => false, 'error' => 'method']);

// Same-origin only (CSRF). Browsers always send Origin on POST.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $oh = parse_url($origin, PHP_URL_HOST);
    $h = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '');
    if (!$oh || strcasecmp($oh, $h) !== 0) out(403, ['ok' => false, 'error' => 'origin']);
}

$raw = file_get_contents('php://input', false, null, 0, 20000);
$in = json_decode($raw ?: '', true);
if (!is_array($in)) out(400, ['ok' => false, 'error' => 'json']);

// Honeypot: pretend success, store nothing.
if (trim((string)($in['company'] ?? '')) !== '') out(200, ['ok' => true]);

$s = fn(string $k, int $max) => mb_substr(trim(strip_tags((string)($in[$k] ?? ''))), 0, $max);
$lead = [
    'type'     => $s('type', 20),
    'location' => $s('location', 80),
    'name'     => $s('name', 120),
    'email'    => mb_strtolower($s('email', 160)),
    'phone'    => $s('phone', 40),
    'message'  => $s('message', 3000),
    'locale'   => $s('locale', 2) === 'en' ? 'en' : 'nl',
    'source'   => $s('source', 40),
    'page'     => $s('page', 200),
    'sid'      => $s('submissionId', 64),
];

$types = ['woning', 'portefeuille', 'commercieel', 'bedrijf', 'anders'];
$digits = preg_replace('/\D/', '', $lead['phone']);
if (!in_array($lead['type'], $types, true)
    || mb_strlen($lead['location']) < 2
    || mb_strlen($lead['name']) < 2
    || !filter_var($lead['email'], FILTER_VALIDATE_EMAIL)
    || strlen($digits) < 9 || strlen($digits) > 15
    || ($in['consent'] ?? false) !== true) {
    out(422, ['ok' => false, 'error' => 'validation']);
}

$dataDir = dirname(__DIR__, 4) . '/hollands_data';
if (!is_dir($dataDir)) @mkdir($dataDir, 0700, true);
$cfgFile = $dataDir . '/config.php';
$cfg = is_file($cfgFile) ? (array)(include $cfgFile) : [];
$notifyTo = $cfg['notify_to'] ?? 'hello@hollandsvastgoedfonds.com';
$mailFrom = $cfg['mail_from'] ?? 'noreply@hollandsvastgoedfonds.com';

$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
$ip = trim(explode(',', $ip)[0]);
$ua = mb_substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 300);
$now = gmdate('c');

try {
    $db = new PDO('sqlite:' . $dataDir . '/leads.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec('CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, type TEXT, location TEXT,
        name TEXT, email TEXT, phone TEXT, message TEXT, locale TEXT, source TEXT, page TEXT,
        ip TEXT, user_agent TEXT, consent_at TEXT, submission_id TEXT UNIQUE)');

    // Rate limit: 6 leads per IP per 10 minutes.
    $q = $db->prepare("SELECT COUNT(*) FROM leads WHERE ip = ? AND created_at > ?");
    $q->execute([$ip, gmdate('c', time() - 600)]);
    if ((int)$q->fetchColumn() >= 6) out(429, ['ok' => false, 'error' => 'rate']);

    $ins = $db->prepare('INSERT OR IGNORE INTO leads
        (created_at, type, location, name, email, phone, message, locale, source, page, ip, user_agent, consent_at, submission_id)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    $ins->execute([$now, $lead['type'], $lead['location'], $lead['name'], $lead['email'], $lead['phone'],
        $lead['message'], $lead['locale'], $lead['source'], $lead['page'], $ip, $ua, $now, $lead['sid'] ?: null]);
    $isNew = $ins->rowCount() === 1;
} catch (Throwable $e) {
    error_log('[lead] db: ' . $e->getMessage());
    out(500, ['ok' => false, 'error' => 'storage']);
}

if ($isNew) {
    $labels = ['woning' => 'Woning', 'portefeuille' => 'Meerdere woningen / portefeuille',
        'commercieel' => 'Kantoor, winkel of mixed-use', 'bedrijf' => 'Bedrijfshal of logistiek', 'anders' => 'Anders'];
    $body = "Nieuwe aanvraag via hollandsvastgoedfonds.com\n\n"
        . "Type:      {$labels[$lead['type']]}\n"
        . "Locatie:   {$lead['location']}\n"
        . "Naam:      {$lead['name']}\n"
        . "E-mail:    {$lead['email']}\n"
        . "Telefoon:  {$lead['phone']}\n"
        . "Taal:      {$lead['locale']}\n"
        . "Formulier: {$lead['source']} ({$lead['page']})\n\n"
        . "Toelichting:\n" . ($lead['message'] !== '' ? $lead['message'] : '-') . "\n";
    $subject = '=?UTF-8?B?' . base64_encode("Nieuwe aanvraag: {$labels[$lead['type']]} in {$lead['location']}") . '?=';
    $replyTo = str_replace(["\r", "\n"], '', $lead['email']);
    $headers = "From: Hollands Vastgoedfonds <{$mailFrom}>\r\nReply-To: {$replyTo}\r\n"
        . "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n";
    @mail($notifyTo, $subject, $body, $headers, '-f' . $mailFrom);
}

out(200, ['ok' => true]);
