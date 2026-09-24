<?php
// GET  /api/v1/webhook        current endpoint and delivery stats
// PUT  /api/v1/webhook        {"url": "https://crm.example.com/hooks/hvf"} set or clear the endpoint
// POST /api/v1/webhook/test   send a signed test event to the endpoint
// POST /api/v1/webhook/redeliver {"id": 123} or {"all_pending": true}
declare(strict_types=1);
require dirname(__DIR__) . '/_crm.php';

api_auth();
$db = crm_db();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = (string)($_GET['action'] ?? '');

$stats = function () use ($db): array {
    $out = ['delivered' => 0, 'pending' => 0, 'failed' => 0];
    foreach ($db->query("SELECT COALESCE(webhook_status,'pending') s, COUNT(*) n FROM leads GROUP BY s")->fetchAll(PDO::FETCH_ASSOC) as $r) $out[$r['s']] = (int)$r['n'];
    return $out;
};

if ($action === 'test') {
    if ($method !== 'POST') api_error(405, 'method_not_allowed', 'Use POST.');
    $sample = crm_lead([
        'id' => 0, 'created_at' => crm_now(), 'updated_at' => crm_now(), 'status' => 'nieuw', 'crm_id' => '',
        'type' => 'portefeuille', 'location' => '1017 AB Amsterdam', 'address' => 'Voorbeeldstraat 1', 'occupancy' => 'verhuurd',
        'units' => '12', 'condition' => 'redelijk', 'timeframe' => '3m', 'price' => 'circa 3 miljoen', 'contact_pref' => 'telefoon',
        'name' => 'Test Lead', 'email' => 'test@example.com', 'phone' => '+31 6 12345678', 'locale' => 'nl',
        'message' => 'Dit is een testbericht van Hollands Vastgoedfonds.', 'source' => 'api-test', 'page' => '/',
        'landing_page' => '/', 'referrer' => '', 'utm_source' => '', 'utm_medium' => '', 'utm_campaign' => '', 'utm_term' => '',
        'utm_content' => '', 'gclid' => '', 'gbraid' => '', 'wbraid' => '', 'fbclid' => '', 'msclkid' => '', 'consent_at' => crm_now(),
    ]);
    [$ok, $info] = crm_post('lead.test', $sample);
    api_json($ok ? 200 : 502, ['data' => ['delivered' => $ok, 'result' => $info]]);
}

if ($action === 'redeliver') {
    if ($method !== 'POST') api_error(405, 'method_not_allowed', 'Use POST.');
    $in = api_body();
    if (!empty($in['all_pending'])) {
        $db->exec("UPDATE leads SET webhook_status = 'pending', webhook_next_at = NULL, webhook_attempts = 0 WHERE webhook_status IN ('pending','failed') OR webhook_status IS NULL");
        $ids = $db->query("SELECT id FROM leads WHERE webhook_status = 'pending' ORDER BY id LIMIT 25")->fetchAll(PDO::FETCH_COLUMN);
    } else {
        $id = (int)($in['id'] ?? 0);
        if ($id < 1) api_error(422, 'invalid_id', 'Send {"id": <lead id>} or {"all_pending": true}.');
        $db->prepare("UPDATE leads SET webhook_status = 'pending', webhook_next_at = NULL WHERE id = ?")->execute([$id]);
        $ids = [$id];
    }
    $res = [];
    foreach ($ids as $i) $res[] = ['id' => (int)$i, 'delivered' => crm_deliver($db, (int)$i)];
    api_json(200, ['data' => ['results' => $res, 'totals' => $stats()]]);
}

if ($method === 'PUT' || $method === 'POST') {
    $in = api_body();
    $url = trim((string)($in['url'] ?? ''));
    if ($url !== '' && ($why = crm_valid_webhook_url($url))) api_error(422, 'invalid_url', $why);
    $s = crm_settings();
    $s['webhook_url'] = $url;
    $s['updated_at'] = crm_now();
    crm_save_settings($s);
}
if (!in_array($method, ['GET', 'PUT', 'POST'], true)) api_error(405, 'method_not_allowed', 'Use GET or PUT.');

$s = crm_settings();
api_json(200, ['data' => [
    'webhook_url' => $s['webhook_url'] ?: null,
    'events' => ['lead.created', 'lead.test'],
    'signature_header' => 'X-HVF-Signature',
    'deliveries' => $stats(),
]]);
