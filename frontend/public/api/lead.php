<?php
// Lead intake for the static site. Validates the form, stores each lead in
// SQLite outside the web root (plus an append-only CSV backup), emails the team
// and sends the seller a confirmation.
//
// Data dir: ~/hollands_data (4 levels above this file on Hostinger:
// ~/domains/<domain>/public_html/api). ~/hollands_data/config.php returns
// ['notify_to' => ..., 'mail_from' => ..., 'export_key' => ...].

declare(strict_types=1);
header_remove('X-Powered-By');
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

$clean = fn($v, int $max) => mb_substr(trim(strip_tags((string)$v)), 0, $max);
$s = fn(string $k, int $max) => $clean($in[$k] ?? '', $max);
$lead = [
    'type'     => $s('type', 20),
    'location' => $s('location', 80),
    'name'     => $s('name', 120),
    'email'    => mb_strtolower($s('email', 160)),
    'phone'    => $s('phone', 40),
    'message'  => $s('message', 3000),
    'locale'   => $s('locale', 2) === 'en' ? 'en' : 'nl',
    'source'   => $s('source', 60),
    'page'     => $s('page', 200),
    'sid'      => $s('submissionId', 64),
];
$attrIn = is_array($in['attribution'] ?? null) ? $in['attribution'] : [];
$attrKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'referrer', 'landing_page'];
$attr = [];
foreach ($attrKeys as $k) $attr[$k] = $clean($attrIn[$k] ?? '', 200);

// Optional details from the full offer form (/vastgoed-aanbieden/). Enum
// fields are allow-listed; anything else is dropped rather than stored.
$pick = fn(string $k, array $ok) => in_array($in[$k] ?? '', $ok, true) ? $in[$k] : '';
$units = (int)($in['units'] ?? 0);
$details = [
    'address'      => $s('address', 120),
    'occupancy'    => $pick('occupancy', ['verhuurd', 'leeg', 'deels', 'eigen']),
    'units'        => ($units >= 1 && $units <= 9999) ? (string)$units : '',
    'condition'    => $pick('condition', ['goed', 'redelijk', 'opknapper', 'onbekend']),
    'timeframe'    => $pick('timeframe', ['direct', '3m', '6m', 'geen']),
    'price'        => $s('price', 60),
    'contact_pref' => $pick('contactPref', ['telefoon', 'email']),
];
$detailKeys = array_keys($details);

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
$mailFrom = $cfg['mail_from'] ?? 'hello@hollandsvastgoedfonds.com';

// REMOTE_ADDR, never X-Forwarded-For: LiteSpeed already resolves the real
// client behind Hostinger's CDN, while XFF's first entry is whatever the client
// sent, so trusting it let anyone skip the rate limit and forge the stored IP.
$ip = (string)($_SERVER['REMOTE_ADDR'] ?? '');
$ua = mb_substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 300);
$now = gmdate('c');

umask(0077); // leads.sqlite and the CSV backup hold personal data: owner-only (600).
try {
    $db = new PDO('sqlite:' . $dataDir . '/leads.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec('CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, type TEXT, location TEXT,
        name TEXT, email TEXT, phone TEXT, message TEXT, locale TEXT, source TEXT, page TEXT,
        ip TEXT, user_agent TEXT, consent_at TEXT, submission_id TEXT UNIQUE)');
    // Additive migrations: attribution + status columns.
    $have = array_column($db->query('PRAGMA table_info(leads)')->fetchAll(PDO::FETCH_ASSOC), 'name');
    foreach (array_merge($attrKeys, ['status'], $detailKeys) as $col) {
        if (!in_array($col, $have, true)) $db->exec("ALTER TABLE leads ADD COLUMN $col TEXT");
    }

    // Rate limit: 6 leads per IP per 10 minutes.
    $q = $db->prepare('SELECT COUNT(*) FROM leads WHERE ip = ? AND created_at > ?');
    $q->execute([$ip, gmdate('c', time() - 600)]);
    if ((int)$q->fetchColumn() >= 6) out(429, ['ok' => false, 'error' => 'rate']);

    $cols = array_merge(['created_at', 'type', 'location', 'name', 'email', 'phone', 'message', 'locale', 'source', 'page', 'ip', 'user_agent', 'consent_at', 'submission_id', 'status'], $attrKeys, $detailKeys);
    $vals = array_merge([$now, $lead['type'], $lead['location'], $lead['name'], $lead['email'], $lead['phone'], $lead['message'],
        $lead['locale'], $lead['source'], $lead['page'], $ip, $ua, $now, $lead['sid'] ?: null, 'nieuw'], array_values($attr), array_values($details));
    $ins = $db->prepare('INSERT OR IGNORE INTO leads (' . implode(',', $cols) . ') VALUES (' . implode(',', array_fill(0, count($cols), '?')) . ')');
    $ins->execute($vals);
    $isNew = $ins->rowCount() === 1;
    $leadId = (int)$db->lastInsertId();
} catch (Throwable $e) {
    error_log('[lead] db: ' . $e->getMessage());
    out(500, ['ok' => false, 'error' => 'storage']);
}

if ($isNew) {
    // Append-only CSV backup next to the database.
    $csv = $dataDir . '/leads-backup.csv';
    $newFile = !is_file($csv);
    // Cells starting with = + - @ run as formulas in Excel; the values come
    // from a public form, so prefix those with ' (plain phone numbers excepted).
    $cell = fn($v) => is_string($v) && preg_match('/^[=+\-@\t\r]/', $v) && !preg_match('/^\+?[\d\s().\/-]+$/', $v) ? "'" . $v : $v;
    if ($fh = @fopen($csv, 'a')) {
        if ($newFile) fputcsv($fh, array_merge(['id'], $cols), ';');
        fputcsv($fh, array_map($cell, array_merge([$leadId], $vals)), ';');
        fclose($fh);
    }

    $labels = ['woning' => 'Woning', 'portefeuille' => 'Meerdere woningen / portefeuille',
        'commercieel' => 'Kantoor, winkel of mixed-use', 'bedrijf' => 'Bedrijfshal of logistiek', 'anders' => 'Anders'];
    $src = $attr['utm_source'] ?: ($attr['gclid'] || $attr['gbraid'] || $attr['wbraid'] ? 'google-ads' : ($attr['fbclid'] ? 'meta-ads' : ($attr['referrer'] ?: 'direct')));
    $enc = fn(string $t) => '=?UTF-8?B?' . base64_encode($t) . '?=';
    $replyTo = str_replace(["\r", "\n"], '', $lead['email']);

    // 1. Notification to the team.
    $body = "Nieuwe aanvraag #{$leadId} via hollandsvastgoedfonds.com\n\n"
        . "Type:      {$labels[$lead['type']]}\n"
        . "Locatie:   {$lead['location']}\n"
        . "Naam:      {$lead['name']}\n"
        . "E-mail:    {$lead['email']}\n"
        . "Telefoon:  {$lead['phone']}\n"
        . "Taal:      {$lead['locale']}\n"
        . ($details['address'] ? "Adres:     {$details['address']}\n" : '')
        . ($details['occupancy'] ? "Situatie:  {$details['occupancy']}\n" : '')
        . ($details['units'] ? "Objecten:  {$details['units']}\n" : '')
        . ($details['condition'] ? "Staat:     {$details['condition']}\n" : '')
        . ($details['timeframe'] ? "Termijn:   {$details['timeframe']}\n" : '')
        . ($details['price'] ? "Prijsidee: {$details['price']}\n" : '')
        . ($details['contact_pref'] ? "Contact:   voorkeur {$details['contact_pref']}\n" : '')
        . "\n"
        . "Toelichting:\n" . ($lead['message'] !== '' ? $lead['message'] : '-') . "\n\n"
        . "Herkomst:  {$src}" . ($attr['utm_campaign'] ? " / {$attr['utm_campaign']}" : '') . "\n"
        . "Landing:   {$attr['landing_page']}\n"
        . "Formulier: {$lead['source']} ({$lead['page']})\n";
    $headers = "From: Hollands Vastgoedfonds <{$mailFrom}>\r\nReply-To: {$replyTo}\r\n"
        . "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n";
    @mail($notifyTo, $enc("Nieuwe aanvraag #{$leadId}: {$labels[$lead['type']]} in {$lead['location']}"), $body, $headers, '-f' . $mailFrom);

    // 2. Confirmation to the seller, in their language.
    // This mails whatever address the form was given, so it must not become a
    // spam/phishing relay: echo name and location only when they look like a
    // name and a place (no links or addresses), and stop confirmations when the
    // whole site gets an unusual burst of leads.
    $first = explode(' ', $lead['name'])[0];
    if (!preg_match("/^\p{L}[\p{L}'-]{0,39}$/u", $first)) $first = $lead['locale'] === 'en' ? 'Sir/Madam' : 'heer/mevrouw';
    if (preg_match('~://|www\.|@|[a-z0-9-]\.[a-z]{2,}~i', $lead['location'])) $lead['location'] = $lead['locale'] === 'en' ? 'the location you gave' : 'de opgegeven locatie';
    $burst = $db->prepare('SELECT COUNT(*) FROM leads WHERE created_at > ?');
    $burst->execute([gmdate('c', time() - 3600)]);
    $sendConfirmation = (int)$burst->fetchColumn() <= 30;
    if ($lead['locale'] === 'en') {
        $subj = 'We have received your request';
        $txt = "Dear {$first},\n\nThank you for your request. We have received the details of your property in {$lead['location']}.\n\n"
            . "One of our acquisition managers will contact you personally. Your request is free of obligation and we treat your details confidentially.\n\n"
            . "If you have any questions in the meantime, simply reply to this email.\n\nKind regards,\n\nHollands Vastgoedfonds\nhttps://hollandsvastgoedfonds.com\n";
    } else {
        $subj = 'Wij hebben uw aanvraag ontvangen';
        $txt = "Beste {$first},\n\nBedankt voor uw aanvraag. Wij hebben de gegevens van uw object in {$lead['location']} ontvangen.\n\n"
            . "Een van onze acquisitiemanagers neemt persoonlijk contact met u op. Uw aanvraag is vrijblijvend en wij gaan vertrouwelijk om met uw gegevens.\n\n"
            . "Heeft u in de tussentijd een vraag? Beantwoord dan gewoon deze e-mail.\n\nMet vriendelijke groet,\n\nHollands Vastgoedfonds\nhttps://hollandsvastgoedfonds.com\n";
    }
    $h2 = "From: Hollands Vastgoedfonds <{$mailFrom}>\r\nReply-To: {$notifyTo}\r\n"
        . "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nAuto-Submitted: auto-replied\r\n";
    if ($sendConfirmation) @mail($replyTo, $enc($subj), $txt, $h2, '-f' . $mailFrom);
}

out(200, ['ok' => true]);
