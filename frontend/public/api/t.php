<?php
// First-party, cookieless analytics. Stores page views and events without IP
// addresses or personal data: path, referring domain, campaign, device class,
// language and a random per-visit id generated in the browser.
declare(strict_types=1);
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { http_response_code(405); exit; }
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
if ($ua === '' || preg_match('/bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|curl|python|wget/i', $ua)) { http_response_code(204); exit; }

$in = json_decode(file_get_contents('php://input', false, null, 0, 4000) ?: '', true);
if (!is_array($in)) { http_response_code(400); exit; }

$c = fn($k, $max) => mb_substr(trim(strip_tags((string)($in[$k] ?? ''))), 0, $max);
$events = ['pageview', 'form_start', 'lead', 'email_click'];
$e = in_array($in['e'] ?? '', $events, true) ? $in['e'] : 'pageview';
$w = (int)($in['w'] ?? 0);
$device = $w === 0 ? '' : ($w < 768 ? 'mobile' : ($w < 1200 ? 'tablet' : 'desktop'));
$path = $c('p', 200);
if ($path === '' || $path[0] !== '/') { http_response_code(400); exit; }

$dataDir = dirname(__DIR__, 4) . '/hollands_data';
umask(0077);
if (!is_dir($dataDir)) @mkdir($dataDir, 0700, true);
try {
    $db = new PDO('sqlite:' . $dataDir . '/analytics.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec('PRAGMA journal_mode=WAL');
    $db->exec('CREATE TABLE IF NOT EXISTS hits (id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT, day TEXT, event TEXT,
        path TEXT, ref TEXT, utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, device TEXT, lang TEXT, sid TEXT, meta TEXT)');
    $db->exec('CREATE INDEX IF NOT EXISTS hits_day ON hits(day)');
    $db->exec('CREATE INDEX IF NOT EXISTS hits_day_sid ON hits(day, sid)');
    // Flood caps: 200 hits per visit per day, 50k hits per day site-wide.
    $day = gmdate('Y-m-d');
    $sidHash = substr(hash('sha256', $c('s', 64)), 0, 16);
    $cap = $db->prepare('SELECT (SELECT COUNT(*) FROM hits WHERE day = ? AND sid = ?), (SELECT COUNT(*) FROM hits WHERE day = ?)');
    $cap->execute([$day, $sidHash, $day]);
    [$perSid, $perDay] = array_map('intval', $cap->fetch(PDO::FETCH_NUM));
    if ($perSid >= 200 || $perDay >= 50000) { http_response_code(204); exit; }
    $st = $db->prepare('INSERT INTO hits (ts, day, event, path, ref, utm_source, utm_medium, utm_campaign, device, lang, sid, meta) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)');
    $st->execute([gmdate('c'), $day, $e, $path, $c('r', 120), $c('us', 80), $c('um', 80), $c('uc', 120), $device,
        $c('l', 2), $sidHash, $c('lt', 20)]);
} catch (Throwable $ex) {
    error_log('[t] ' . $ex->getMessage());
}
http_response_code(204);
