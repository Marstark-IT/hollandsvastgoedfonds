<?php
// GET /api/v1/health  authenticated connectivity check
declare(strict_types=1);
require dirname(__DIR__) . '/_crm.php';

api_auth();
$db = crm_db();
api_json(200, ['data' => [
    'ok' => true,
    'time' => crm_now(),
    'leads_total' => (int)$db->query('SELECT COUNT(*) FROM leads')->fetchColumn(),
    'webhook_configured' => (string)(crm_settings()['webhook_url'] ?? '') !== '',
    'api_version' => 'v1',
]]);
