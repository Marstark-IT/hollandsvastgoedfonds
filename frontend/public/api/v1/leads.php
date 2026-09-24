<?php
// GET   /api/v1/leads            list leads (since_id | updated_since | status, limit)
// GET   /api/v1/leads/{id}       one lead
// PATCH /api/v1/leads/{id}       update status and/or crm_id from the CRM
declare(strict_types=1);
require dirname(__DIR__) . '/_crm.php';

api_auth();
$db = crm_db();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id > 0) {
    $q = $db->prepare('SELECT * FROM leads WHERE id = ?');
    $q->execute([$id]);
    $row = $q->fetch(PDO::FETCH_ASSOC);
    if (!$row) api_error(404, 'not_found', "Lead $id does not exist.");

    if ($method === 'PATCH' || $method === 'POST') {
        $in = api_body();
        $sets = [];
        $vals = [];
        if (array_key_exists('status', $in)) {
            if (!in_array($in['status'], CRM_STATUSES, true)) api_error(422, 'invalid_status', 'status must be one of: ' . implode(', ', CRM_STATUSES));
            $sets[] = 'status = ?';
            $vals[] = $in['status'];
        }
        if (array_key_exists('crm_id', $in)) {
            $cid = mb_substr(trim(strip_tags((string)$in['crm_id'])), 0, 120);
            $sets[] = 'crm_id = ?';
            $vals[] = $cid === '' ? null : $cid;
        }
        if (!$sets) api_error(422, 'nothing_to_update', 'Send "status" and/or "crm_id".');
        $sets[] = 'updated_at = ?';
        $vals[] = crm_now();
        $vals[] = $id;
        $db->prepare('UPDATE leads SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($vals);
        $q->execute([$id]);
        $row = $q->fetch(PDO::FETCH_ASSOC);
    } elseif ($method !== 'GET') {
        api_error(405, 'method_not_allowed', 'Use GET or PATCH.');
    }
    api_json(200, ['data' => crm_lead($row)]);
}

if ($method !== 'GET') api_error(405, 'method_not_allowed', 'Use GET.');

$limit = max(1, min(200, (int)($_GET['limit'] ?? 50)));
$where = [];
$vals = [];
if (isset($_GET['since_id'])) {
    $where[] = 'id > ?';
    $vals[] = max(0, (int)$_GET['since_id']);
}
if (!empty($_GET['updated_since'])) {
    $t = strtotime((string)$_GET['updated_since']);
    if (!$t) api_error(422, 'invalid_date', 'updated_since must be an ISO 8601 date-time.');
    $where[] = "COALESCE(updated_at, created_at) > ?";
    $vals[] = gmdate('Y-m-d\TH:i:s', $t);
}
if (!empty($_GET['status'])) {
    if (!in_array($_GET['status'], CRM_STATUSES, true)) api_error(422, 'invalid_status', 'status must be one of: ' . implode(', ', CRM_STATUSES));
    $where[] = 'status = ?';
    $vals[] = $_GET['status'];
}
$sql = 'SELECT * FROM leads' . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY id ASC LIMIT ' . ($limit + 1);
$q = $db->prepare($sql);
$q->execute($vals);
$rows = $q->fetchAll(PDO::FETCH_ASSOC);
$more = count($rows) > $limit;
$rows = array_slice($rows, 0, $limit);
$data = array_map('crm_lead', $rows);
$lastId = $rows ? (int)end($rows)['id'] : (int)($_GET['since_id'] ?? 0);

crm_retry_pending();
api_json(200, ['data' => $data, 'meta' => ['count' => count($data), 'has_more' => $more, 'next_since_id' => $lastId]]);
