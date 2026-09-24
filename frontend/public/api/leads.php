<?php
// CSV export of stored leads: /api/leads.php?key=<export_key from config.php>
declare(strict_types=1);
header('X-Robots-Tag: noindex');
$dataDir = dirname(__DIR__, 4) . '/hollands_data';
$cfg = is_file($dataDir . '/config.php') ? (array)(include $dataDir . '/config.php') : [];
$key = (string)($cfg['export_key'] ?? '');
if ($key === '' || !hash_equals($key, (string)($_GET['key'] ?? ''))) {
    http_response_code(404);
    exit;
}
$db = new PDO('sqlite:' . $dataDir . '/leads.sqlite');
$rows = $db->query('SELECT id, created_at, type, location, name, email, phone, message, locale, source, page FROM leads ORDER BY id DESC')->fetchAll(PDO::FETCH_ASSOC);
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="leads-' . gmdate('Y-m-d') . '.csv"');
$out = fopen('php://output', 'w');
fwrite($out, "\xEF\xBB\xBF");
fputcsv($out, ['id', 'created_at', 'type', 'location', 'name', 'email', 'phone', 'message', 'locale', 'source', 'page'], ';');
foreach ($rows as $r) fputcsv($out, array_values($r), ';');
