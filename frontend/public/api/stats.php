<?php
// Operations dashboard: traffic, sources, conversion and the lead list with a
// status per lead. Access: https://hollandsvastgoedfonds.com/api/stats.php
// The browser asks for a login: any username, password = export_key from
// config.php (HTTP Basic, same as leads.php, so the key never sits in a URL).
declare(strict_types=1);
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");

$dataDir = dirname(__DIR__, 4) . '/hollands_data';
$cfg = is_file($dataDir . '/config.php') ? (array)(include $dataDir . '/config.php') : [];
$key = (string)($cfg['export_key'] ?? '');
$given = (string)($_SERVER['PHP_AUTH_PW'] ?? '');
$auth = (string)($_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
if ($given === '' && stripos($auth, 'basic ') === 0) {
    $given = explode(':', (string)base64_decode(substr($auth, 6)), 2)[1] ?? '';
}
if ($key === '' || !hash_equals($key, $given)) {
    header('WWW-Authenticate: Basic realm="Hollands dashboard", charset="UTF-8"');
    http_response_code(401);
    exit;
}

$h = fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
$days = in_array((int)($_GET['d'] ?? 30), [7, 30, 90, 365], true) ? (int)$_GET['d'] : 30;
$since = gmdate('Y-m-d', time() - ($days - 1) * 86400);
$statuses = ['nieuw', 'gecontacteerd', 'bezichtiging', 'voorstel', 'gekocht', 'afgewezen'];

$leadsDb = is_file($dataDir . '/leads.sqlite') ? new PDO('sqlite:' . $dataDir . '/leads.sqlite') : null;
if ($leadsDb) {
    $cols = array_column($leadsDb->query('PRAGMA table_info(leads)')->fetchAll(PDO::FETCH_ASSOC), 'name');
    if (!in_array('status', $cols, true)) $leadsDb->exec('ALTER TABLE leads ADD COLUMN status TEXT');
    foreach (['utm_source', 'utm_campaign', 'gclid', 'fbclid', 'referrer', 'landing_page', 'address', 'occupancy', 'units', 'condition', 'timeframe', 'price', 'contact_pref'] as $c) {
        if (!in_array($c, $cols, true)) $leadsDb->exec("ALTER TABLE leads ADD COLUMN $c TEXT");
    }
}
$sameOrigin = strcasecmp((string)parse_url((string)($_SERVER['HTTP_ORIGIN'] ?? ''), PHP_URL_HOST), preg_replace('/:\d+$/', '', (string)($_SERVER['HTTP_HOST'] ?? ''))) === 0;
if ($leadsDb && $sameOrigin && ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && isset($_POST['id'], $_POST['status']) && in_array($_POST['status'], $statuses, true)) {
    $leadsDb->prepare('UPDATE leads SET status = ? WHERE id = ?')->execute([$_POST['status'], (int)$_POST['id']]);
    header('Location: stats.php?d=' . $days . '#leads');
    exit;
}

$aDb = is_file($dataDir . '/analytics.sqlite') ? new PDO('sqlite:' . $dataDir . '/analytics.sqlite') : null;
$q = function (?PDO $db, string $sql, array $p = []) {
    if (!$db) return [];
    try { $s = $db->prepare($sql); $s->execute($p); return $s->fetchAll(PDO::FETCH_ASSOC); } catch (Throwable $e) { return []; }
};
$one = fn(?PDO $db, string $sql, array $p = []) => (int)($q($db, $sql, $p)[0]['n'] ?? 0);

$pv = $one($aDb, "SELECT COUNT(*) n FROM hits WHERE event='pageview' AND day >= ?", [$since]);
$visits = $one($aDb, "SELECT COUNT(DISTINCT sid) n FROM hits WHERE day >= ?", [$since]);
$starts = $one($aDb, "SELECT COUNT(DISTINCT sid) n FROM hits WHERE event='form_start' AND day >= ?", [$since]);
$leads = $one($leadsDb, "SELECT COUNT(*) n FROM leads WHERE substr(created_at,1,10) >= ?", [$since]);
$conv = $visits ? round($leads / $visits * 100, 2) : 0;

$daily = $q($aDb, "SELECT day, COUNT(DISTINCT sid) v, SUM(event='pageview') pv FROM hits WHERE day >= ? GROUP BY day ORDER BY day", [$since]);
$leadDaily = [];
foreach ($q($leadsDb, "SELECT substr(created_at,1,10) day, COUNT(*) n FROM leads WHERE substr(created_at,1,10) >= ? GROUP BY day", [$since]) as $r) $leadDaily[$r['day']] = (int)$r['n'];
$maxV = max(1, ...array_map(fn($r) => (int)$r['v'], $daily ?: [['v' => 1]]));

$pages = $q($aDb, "SELECT path, COUNT(*) n FROM hits WHERE event='pageview' AND day >= ? GROUP BY path ORDER BY n DESC LIMIT 15", [$since]);
$sources = $q($aDb, "SELECT CASE WHEN utm_source<>'' THEN utm_source WHEN ref<>'' THEN ref ELSE 'direct' END src, COUNT(DISTINCT sid) n FROM hits WHERE day >= ? GROUP BY src ORDER BY n DESC LIMIT 12", [$since]);
$devices = $q($aDb, "SELECT device, COUNT(DISTINCT sid) n FROM hits WHERE day >= ? AND device<>'' GROUP BY device ORDER BY n DESC", [$since]);
$campaigns = $q($aDb, "SELECT utm_campaign c, COUNT(DISTINCT sid) v, SUM(event='lead') l FROM hits WHERE day >= ? AND utm_campaign<>'' GROUP BY c ORDER BY v DESC LIMIT 10", [$since]);
$bySource = $q($leadsDb, "SELECT CASE WHEN utm_source<>'' THEN utm_source WHEN gclid<>'' THEN 'google-ads' WHEN fbclid<>'' THEN 'meta-ads' WHEN referrer<>'' THEN referrer ELSE 'direct' END src, COUNT(*) n FROM leads WHERE substr(created_at,1,10) >= ? GROUP BY src ORDER BY n DESC", [$since]);
$byType = $q($leadsDb, "SELECT type, COUNT(*) n FROM leads WHERE substr(created_at,1,10) >= ? GROUP BY type ORDER BY n DESC", [$since]);
$list = $q($leadsDb, "SELECT id, created_at, type, location, name, email, phone, message, locale, source, status, utm_source, utm_campaign, gclid, fbclid, referrer, landing_page, address, occupancy, units, condition, timeframe, price, contact_pref FROM leads ORDER BY id DESC LIMIT 100");

?><!doctype html>
<html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Dashboard | Hollands Vastgoedfonds</title>
<style>
*{box-sizing:border-box}body{margin:0;font:16px/1.5 system-ui,sans-serif;background:#F3F4F4;color:#1E2A33}
header{background:#0A2B46;color:#fff;padding:18px 24px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between}
header a{color:#fff;margin-left:10px}main{max-width:1280px;margin:0 auto;padding:24px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px}.card{background:#fff;border-radius:4px;padding:18px}
.kpi b{display:block;font-size:30px;color:#0F3B5F}.kpi span{color:#4A5561;font-size:14px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;margin-top:14px}
h2{font-size:17px;margin:0 0 12px;color:#0F3B5F}table{width:100%;border-collapse:collapse;font-size:14px}
td,th{padding:7px 8px;border-bottom:1px solid #E4E8EB;text-align:left;vertical-align:top}th{color:#4A5561;font-weight:600}
.bars{display:flex;align-items:flex-end;gap:3px;height:140px}.bars div{flex:1;background:#1F5F86;min-height:2px;position:relative}
.bars div.l{background:#C75B0B}.num{text-align:right}.wrap{overflow-x:auto}select,button{font:inherit;padding:4px 6px}
.muted{color:#4A5561;font-size:13px}.pill{display:inline-block;padding:1px 8px;border-radius:99px;background:#E8F0F6;font-size:12px}
</style></head><body>
<header><strong>Hollands Vastgoedfonds · Dashboard</strong>
<nav>Periode: <?php foreach ([7, 30, 90, 365] as $d): ?><a href="?d=<?= $d ?>"<?= $d === $days ? ' style="font-weight:700;text-decoration:none"' : '' ?>><?= $d ?>d</a><?php endforeach ?>
 · <a href="leads.php">CSV export</a></nav></header>
<main>
<section class="kpis">
<div class="card kpi"><b><?= $visits ?></b><span>Bezoeken</span></div>
<div class="card kpi"><b><?= $pv ?></b><span>Paginaweergaven</span></div>
<div class="card kpi"><b><?= $starts ?></b><span>Formulier gestart</span></div>
<div class="card kpi"><b><?= $leads ?></b><span>Aanvragen</span></div>
<div class="card kpi"><b><?= $conv ?>%</b><span>Conversie (aanvragen / bezoeken)</span></div>
</section>

<section class="card" style="margin-top:14px"><h2>Bezoeken per dag <span class="muted">(oranje = dag met aanvraag)</span></h2>
<div class="bars"><?php foreach ($daily as $r): $hgt = max(2, (int)round($r['v'] / $maxV * 140)); ?>
<div class="<?= isset($leadDaily[$r['day']]) ? 'l' : '' ?>" style="height:<?= $hgt ?>px" title="<?= $h($r['day']) ?>: <?= (int)$r['v'] ?> bezoeken, <?= $leadDaily[$r['day']] ?? 0 ?> aanvragen"></div><?php endforeach ?></div>
<?php if (!$daily): ?><p class="muted">Nog geen data in deze periode.</p><?php endif ?></section>

<section class="grid">
<div class="card"><h2>Bronnen (bezoeken)</h2><table><?php foreach ($sources as $r): ?><tr><td><?= $h($r['src']) ?></td><td class="num"><?= (int)$r['n'] ?></td></tr><?php endforeach ?></table></div>
<div class="card"><h2>Aanvragen per bron</h2><table><?php foreach ($bySource as $r): ?><tr><td><?= $h($r['src']) ?></td><td class="num"><?= (int)$r['n'] ?></td></tr><?php endforeach ?></table></div>
<div class="card"><h2>Aanvragen per type</h2><table><?php foreach ($byType as $r): ?><tr><td><?= $h($r['type']) ?></td><td class="num"><?= (int)$r['n'] ?></td></tr><?php endforeach ?></table></div>
<div class="card"><h2>Apparaten</h2><table><?php foreach ($devices as $r): ?><tr><td><?= $h($r['device']) ?></td><td class="num"><?= (int)$r['n'] ?></td></tr><?php endforeach ?></table></div>
</section>
<section class="grid">
<div class="card"><h2>Populaire pagina's</h2><table><?php foreach ($pages as $r): ?><tr><td><?= $h($r['path']) ?></td><td class="num"><?= (int)$r['n'] ?></td></tr><?php endforeach ?></table></div>
<div class="card"><h2>Campagnes</h2><table><tr><th>Campagne</th><th class="num">Bezoeken</th><th class="num">Aanvragen</th></tr><?php foreach ($campaigns as $r): ?><tr><td><?= $h($r['c']) ?></td><td class="num"><?= (int)$r['v'] ?></td><td class="num"><?= (int)$r['l'] ?></td></tr><?php endforeach ?></table></div>
</section>

<section class="card" id="leads" style="margin-top:14px"><h2>Laatste aanvragen</h2><div class="wrap"><table>
<tr><th>#</th><th>Datum</th><th>Type</th><th>Locatie</th><th>Naam</th><th>Contact</th><th>Bron</th><th>Status</th></tr>
<?php foreach ($list as $r): $src = $r['utm_source'] ?: ($r['gclid'] ? 'google-ads' : ($r['fbclid'] ? 'meta-ads' : ($r['referrer'] ?: 'direct'))); ?>
<tr><td><?= (int)$r['id'] ?></td><td><?= $h(substr((string)$r['created_at'], 0, 16)) ?></td><td><?= $h($r['type']) ?></td><td><?= $h($r['location']) ?><?php if ($r['address']): ?><div class="muted"><?= $h($r['address']) ?></div><?php endif ?><?php $d = array_filter([$r['occupancy'], $r['units'] ? $r['units'] . ' obj.' : '', $r['condition'], $r['timeframe'], $r['price'], $r['contact_pref'] ? 'via ' . $r['contact_pref'] : '']); if ($d): ?><div class="muted"><?= $h(implode(' · ', $d)) ?></div><?php endif ?></td>
<td><?= $h($r['name']) ?><?php if ($r['message']): ?><div class="muted"><?= nl2br($h($r['message'])) ?></div><?php endif ?></td>
<td><a href="mailto:<?= $h($r['email']) ?>"><?= $h($r['email']) ?></a><br><a href="tel:<?= $h(preg_replace('/[^+\d]/', '', (string)$r['phone'])) ?>"><?= $h($r['phone']) ?></a></td>
<td><span class="pill"><?= $h($src) ?></span><?php if ($r['utm_campaign']): ?><div class="muted"><?= $h($r['utm_campaign']) ?></div><?php endif ?><div class="muted"><?= $h($r['source']) ?> · <?= $h($r['locale']) ?></div></td>
<td><form method="post" action="stats.php?d=<?= $days ?>"><input type="hidden" name="id" value="<?= (int)$r['id'] ?>">
<select name="status"><?php foreach ($statuses as $st): ?><option<?= ($r['status'] ?: 'nieuw') === $st ? ' selected' : '' ?>><?= $st ?></option><?php endforeach ?></select> <button>OK</button></form></td></tr>
<?php endforeach ?></table><?php if (!$list): ?><p class="muted">Nog geen aanvragen.</p><?php endif ?></div></section>
<p class="muted">Bezoekersdata zonder cookies of IP-adressen. Gegevens staan buiten de webroot in ~/hollands_data.</p>
</main></body></html>
