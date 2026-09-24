# Hollands Vastgoedfonds: Lead API and Webhooks (CRM integration)

> Public reference copy without credentials. The CRM developer receives the
> version with the live API key and webhook secret separately.

**Instructions for Claude (or any AI coding assistant) reading this file:**
You are integrating a CRM with the lead intake of hollandsvastgoedfonds.com.
Everything you need is in this document. Implement, in the CRM codebase:

1. Store `HVF_API_KEY` and `HVF_WEBHOOK_SECRET` (section 2) as environment
   variables / secrets. Never hard-code them.
2. Build a public HTTPS webhook endpoint that verifies `X-HVF-Signature`
   (section 5), rejects invalid or stale signatures with HTTP 401, is idempotent
   on `data.id`, upserts the lead into the CRM and returns HTTP 2xx within
   10 seconds (do heavy work asynchronously).
3. Register that endpoint URL with `PUT /api/v1/webhook` (section 4.4), then run
   `POST /api/v1/webhook/test` and confirm the test event arrives and verifies.
4. Build a backfill / safety-net sync job that pages through
   `GET /api/v1/leads?since_id=` (section 4.2) and upserts every lead. Run it
   once at setup and then periodically (for example every 15 minutes).
5. When a lead's status changes in the CRM, write it back with
   `PATCH /api/v1/leads/{id}` (section 4.3), and send the CRM's own record id as
   `crm_id` the first time the lead is created in the CRM.
6. Run the checklist in section 9 and report the results.

---

## 1. Overview

Every form on hollandsvastgoedfonds.com (homepage, property pages, city pages,
articles, contact page, offer page) uses **one** three-step lead form. Each
submission is stored in the website database and then made available to the
CRM in two ways:

| Channel | Direction | When | Use it for |
|---|---|---|---|
| **Webhook** `lead.created` | Website pushes to CRM | Seconds after the visitor submits | Live, real-time lead creation |
| **REST API** `/api/v1` | CRM pulls from website | Whenever the CRM calls it | Backfill, safety net, lookups, status write-back |

The webhook is the primary path. The REST API guarantees nothing is lost if the
CRM endpoint is down: failed webhooks are retried, and the CRM can always
re-sync with `since_id`.

## 2. Credentials

| Name | Value | Used for |
|---|---|---|
| Base URL | `https://hollandsvastgoedfonds.com/api/v1` | All REST calls |
| `HVF_API_KEY` | `<provided separately>` | REST API authentication (Bearer token) |
| `HVF_WEBHOOK_SECRET` | `<provided separately>` | Verifying webhook signatures (HMAC-SHA256) |

Suggested `.env` for the CRM:

```env
HVF_API_BASE=https://hollandsvastgoedfonds.com/api/v1
HVF_API_KEY=<provided separately>
HVF_WEBHOOK_SECRET=<provided separately>
```

Key rotation: ask the website owner. Keys live on the web server in
`~/hollands_data/config.php` (`crm_api_key`, `crm_webhook_secret`).

## 3. Authentication and limits

- Send the API key on every request:
  `Authorization: Bearer <HVF_API_KEY>` (alternative header: `X-API-Key: <HVF_API_KEY>`).
- HTTPS only. Server-to-server only (no CORS, do not call from a browser).
- Rate limit: **60 requests per minute**. Headers `X-RateLimit-Limit` and
  `X-RateLimit-Remaining` are returned; on HTTP 429 wait for `Retry-After` seconds.
- Missing or wrong key: HTTP 401 with `WWW-Authenticate: Bearer`.

Error format (all errors):

```json
{ "error": { "code": "invalid_status", "message": "status must be one of: nieuw, gecontacteerd, bezichtiging, voorstel, gekocht, afgewezen" } }
```

| HTTP | code | Meaning |
|---|---|---|
| 401 | `unauthorized` | Missing or invalid API key |
| 404 | `not_found` | Lead id does not exist |
| 405 | `method_not_allowed` | Wrong HTTP method |
| 422 | `invalid_status`, `invalid_date`, `invalid_url`, `invalid_id`, `nothing_to_update` | Bad input |
| 429 | `rate_limited` | More than 60 requests per minute |
| 502 | - | Test webhook could not be delivered (see `result`) |

## 4. REST endpoints

### 4.1 Health check

`GET /api/v1/health`

```bash
curl -s https://hollandsvastgoedfonds.com/api/v1/health -H "Authorization: Bearer $HVF_API_KEY"
```

```json
{ "data": { "ok": true, "time": "2026-09-24T03:23:36Z", "leads_total": 0, "webhook_configured": false, "api_version": "v1" } }
```

### 4.2 List leads

`GET /api/v1/leads`

| Query parameter | Type | Description |
|---|---|---|
| `since_id` | integer | Only leads with `id` greater than this. Use for backfill / incremental sync. |
| `updated_since` | ISO 8601 | Only leads created or updated after this moment (e.g. `2026-09-24T00:00:00Z`). |
| `status` | string | Filter on status (see section 6). |
| `limit` | integer | 1 to 200, default 50. |

Results are ordered by `id` ascending. Paginate with `meta.next_since_id` while
`meta.has_more` is `true`:

```bash
curl -s "https://hollandsvastgoedfonds.com/api/v1/leads?since_id=0&limit=100" -H "Authorization: Bearer $HVF_API_KEY"
```

```json
{
  "data": [ { "...": "lead object, see section 6" } ],
  "meta": { "count": 1, "has_more": false, "next_since_id": 23 }
}
```

### 4.3 Get or update one lead

`GET /api/v1/leads/{id}` returns `{ "data": <lead> }`.

`PATCH /api/v1/leads/{id}` updates the status and/or the CRM's own id. Both
fields are optional; send at least one.

```bash
curl -s -X PATCH https://hollandsvastgoedfonds.com/api/v1/leads/23 \
  -H "Authorization: Bearer $HVF_API_KEY" -H "Content-Type: application/json" \
  -d '{"status":"gecontacteerd","crm_id":"CRM-000123"}'
```

Returns the updated lead. `updated_at` is set to the time of the change. The
status is also shown in the website owner's dashboard.

### 4.4 Webhook endpoint registration

| Method and path | Body | Purpose |
|---|---|---|
| `GET /api/v1/webhook` | - | Current URL and delivery totals |
| `PUT /api/v1/webhook` | `{"url": "https://crm.example.com/webhooks/hvf"}` | Set the endpoint (`{"url": ""}` disables) |
| `POST /api/v1/webhook/test` | - | Send a signed `lead.test` event to the endpoint now |
| `POST /api/v1/webhook/redeliver` | `{"id": 23}` or `{"all_pending": true}` | Push a lead again, or retry everything pending/failed |

```bash
curl -s -X PUT https://hollandsvastgoedfonds.com/api/v1/webhook \
  -H "Authorization: Bearer $HVF_API_KEY" -H "Content-Type: application/json" \
  -d '{"url":"https://crm.example.com/webhooks/hvf"}'

curl -s -X POST https://hollandsvastgoedfonds.com/api/v1/webhook/test -H "Authorization: Bearer $HVF_API_KEY"
# {"data":{"delivered":true,"result":"HTTP 200"}}
```

Rules for the URL: must be `https://`, no credentials in the URL, must resolve
to a public IP address (private and loopback addresses are refused).

`GET /api/v1/webhook` response:

```json
{ "data": { "webhook_url": "https://crm.example.com/webhooks/hvf", "events": ["lead.created", "lead.test"], "signature_header": "X-HVF-Signature", "deliveries": { "delivered": 12, "pending": 0, "failed": 0 } } }
```

## 5. Webhooks

### 5.1 Request

`POST <your webhook URL>` with `Content-Type: application/json`.

| Header | Example | Meaning |
|---|---|---|
| `X-HVF-Event` | `lead.created` | `lead.created` for real leads, `lead.test` for tests |
| `X-HVF-Delivery` | `ac9bd9d67354ba0881a731fdb33c...` | Unique id of this delivery attempt |
| `X-HVF-Signature` | `t=1790227584,v1=5f2b...` | Timestamp and HMAC signature |
| `User-Agent` | `HollandsVastgoedfonds-Webhooks/1.0` | |

Body:

```json
{
  "event": "lead.created",
  "delivery_id": "ac9bd9d67354ba0881a731fdb33c2c1e",
  "sent_at": "2026-09-24T03:26:24Z",
  "data": { "...": "lead object, see section 6" }
}
```

### 5.2 Verify the signature (required)

`X-HVF-Signature` is `t=<unix seconds>,v1=<hex>` where
`v1 = HMAC_SHA256(HVF_WEBHOOK_SECRET, "<t>.<raw request body>")`.

1. Read the **raw** body bytes (before any JSON parsing).
2. Parse `t` and `v1` from the header.
3. Reject if `|now - t| > 300` seconds (replay protection).
4. Compute the HMAC and compare with a **constant-time** comparison.
5. Reject with HTTP 401 on any mismatch.

**Node.js (Express):**

```js
import crypto from "node:crypto";
import express from "express";

const app = express();
app.post("/webhooks/hvf", express.raw({ type: "application/json" }), async (req, res) => {
  const header = req.get("X-HVF-Signature") || "";
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=")));
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) return res.status(401).send("stale");
  const expected = crypto.createHmac("sha256", process.env.HVF_WEBHOOK_SECRET).update(`${t}.${req.body}`).digest("hex");
  const ok = parts.v1 && expected.length === parts.v1.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
  if (!ok) return res.status(401).send("bad signature");

  const event = JSON.parse(req.body.toString("utf8"));
  res.status(200).send("ok"); // acknowledge fast, then process
  if (event.event === "lead.created") await upsertLead(event.data); // idempotent on event.data.id
});
```

**Python (FastAPI):**

```python
import hmac, hashlib, json, os, time
from fastapi import FastAPI, Request, HTTPException

app = FastAPI()

@app.post("/webhooks/hvf")
async def hvf_webhook(request: Request):
    raw = await request.body()
    parts = dict(p.split("=", 1) for p in request.headers.get("X-HVF-Signature", "").split(",") if "=" in p)
    t = int(parts.get("t", 0))
    if not t or abs(time.time() - t) > 300:
        raise HTTPException(401, "stale")
    expected = hmac.new(os.environ["HVF_WEBHOOK_SECRET"].encode(), f"{t}.".encode() + raw, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, parts.get("v1", "")):
        raise HTTPException(401, "bad signature")
    event = json.loads(raw)
    if event["event"] == "lead.created":
        upsert_lead(event["data"])  # idempotent on event["data"]["id"]
    return {"ok": True}
```

**PHP:**

```php
$raw = file_get_contents('php://input');
parse_str(str_replace(',', '&', $_SERVER['HTTP_X_HVF_SIGNATURE'] ?? ''), $p);
$ok = isset($p['t'], $p['v1']) && abs(time() - (int)$p['t']) < 300
   && hash_equals(hash_hmac('sha256', $p['t'] . '.' . $raw, getenv('HVF_WEBHOOK_SECRET')), $p['v1']);
if (!$ok) { http_response_code(401); exit('bad signature'); }
$event = json_decode($raw, true);
```

### 5.3 Delivery, retries, idempotency

- The lead is pushed right after the visitor's form is submitted.
- Any HTTP **2xx** within **10 seconds** counts as delivered. Redirects are not followed.
- Otherwise the delivery is retried after 1 min, 5 min, 15 min, 1 h, 3 h, 6 h,
  12 h and 24 h (9 attempts in total), then marked `failed`. Retries run on the
  website's normal traffic and API calls, so a retry can arrive a little later
  than scheduled. Use `POST /api/v1/webhook/redeliver` to force it.
- The same lead can arrive more than once (retries, redeliver, backfill).
  **Upsert on `data.id`**; `X-HVF-Delivery` differs per attempt.
- `lead.test` events have `data.id = 0`. Verify them, then ignore.

## 6. Lead object

```json
{
  "id": 23,
  "created_at": "2026-09-24T03:26:24Z",
  "updated_at": "2026-09-24T03:26:50Z",
  "status": "nieuw",
  "crm_id": null,
  "property": {
    "type": "bedrijf",
    "type_label": "Bedrijfshal of logistiek",
    "location": "5041 AB Tilburg",
    "address": "Testweg 10",
    "occupancy": "verhuurd",
    "units": null,
    "condition": "goed",
    "timeframe": "6m",
    "price_indication": null
  },
  "contact": {
    "name": "Jan de Vries",
    "email": "jan@example.nl",
    "phone": "0612345678",
    "preferred_contact": "telefoon",
    "language": "nl"
  },
  "message": null,
  "source": {
    "form": "hero",
    "page": "/",
    "landing_page": "/",
    "referrer": null,
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "verhuurde-woning",
    "utm_term": null,
    "utm_content": null,
    "gclid": "Cj0KCQjw...",
    "gbraid": null,
    "wbraid": null,
    "fbclid": null,
    "msclkid": null
  },
  "consent": { "given": true, "at": "2026-09-24T03:26:24Z" }
}
```

All timestamps are UTC, ISO 8601. Missing optional values are `null`.

### Field reference and allowed values

| Field | Values (label) | Required on the form |
|---|---|---|
| `property.type` | `woning` (Woning), `portefeuille` (Meerdere woningen / portefeuille), `commercieel` (Kantoor, winkel of mixed-use), `bedrijf` (Bedrijfshal of logistiek), `anders` (Anders) | yes |
| `property.location` | Postcode and/or town, e.g. `1017 AB Amsterdam` | yes |
| `property.address` | Street and number, free text | no |
| `property.occupancy` | `verhuurd` (fully let), `deels` (partly let), `leeg` (vacant), `eigen` (own use) | yes |
| `property.units` | Integer 1 to 9999, only asked for `portefeuille` | no |
| `property.condition` | `goed` (good), `redelijk` (fair), `opknapper` (needs work), `onbekend` (unknown) | no |
| `property.timeframe` | `direct` (asap), `3m` (within 3 months), `6m` (within 6 months), `geen` (no rush) | yes |
| `property.price_indication` | Free text, e.g. `circa 450.000` | no |
| `contact.name`, `contact.email`, `contact.phone` | Validated on the website (phone: 9 to 15 digits) | yes |
| `contact.preferred_contact` | `telefoon` (call), `email` | yes |
| `contact.language` | `nl`, `en` (use it for replies) | yes |
| `message` | Free text, max 3000 characters | no |
| `status` | `nieuw`, `gecontacteerd`, `bezichtiging`, `voorstel`, `gekocht`, `afgewezen` | set by website/CRM |
| `source.form` | Where the form was: `hero`, `home-form`, `buy-form`, `segment-residential`, `segment-commercial`, `segment-industrial`, `segment-special`, `region-<city>`, `article-<slug>`, `contact`, `about-form`, `kennisbank`, `regions`, `offer-page` | - |

Suggested CRM status mapping: `nieuw` = New, `gecontacteerd` = Contacted,
`bezichtiging` = Viewing planned, `voorstel` = Proposal sent, `gekocht` = Won
(purchased), `afgewezen` = Lost / rejected.

## 7. What the website already does

- Validates every field, blocks bots (honeypot) and limits 6 submissions per IP per 10 minutes.
- Stores the lead (SQLite, outside the web root) plus a CSV backup.
- Emails the team at hello@hollandsvastgoedfonds.com and sends the seller a confirmation.
- Pushes the lead to the CRM webhook and exposes it on the API.
- The owner's dashboard (`/api/stats.php`) shows per lead whether the CRM received it (`delivered`, `pending`, `failed`) and the `crm_id`.

## 8. Privacy (AVG / GDPR)

Leads contain personal data. The seller consented to processing for handling
their request. In the CRM: restrict access, do not use the data for unrelated
marketing, and delete leads that do not lead to a transaction within 24 months
of the last contact (the website's privacy statement promises this).

## 9. Go-live checklist

- [ ] `GET /api/v1/health` returns `ok: true` with the API key.
- [ ] Webhook endpoint deployed on HTTPS, verifying signatures and rejecting a tampered body with 401.
- [ ] `PUT /api/v1/webhook` set to the CRM endpoint; `GET /api/v1/webhook` shows it.
- [ ] `POST /api/v1/webhook/test` returns `delivered: true` and the CRM logs a verified `lead.test`.
- [ ] Backfill job ran: `GET /api/v1/leads?since_id=0` fully imported (follow `has_more`).
- [ ] A real test lead submitted on https://hollandsvastgoedfonds.com/vastgoed-aanbieden/ appears in the CRM within seconds.
- [ ] Status change in the CRM calls `PATCH /api/v1/leads/{id}` and the change is visible via `GET /api/v1/leads/{id}`.
- [ ] Test leads deleted in the CRM, and the website owner asked to delete them on the website side.
