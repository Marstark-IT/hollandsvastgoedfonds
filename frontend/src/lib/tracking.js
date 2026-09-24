// Client-side tracking helpers. No cookies: attribution lives in sessionStorage
// for the visit only, analytics goes to our own endpoint (/api/t.php) without
// personal data. Marketing tags (GTM) only receive events via dataLayer and only
// act on them after consent (Consent Mode v2, see components/analytics).

const ATTR_KEY = "hvf_attr";
const SID_KEY = "hvf_sid";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid", "msclkid"];

const store = () => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

export function sessionId() {
  const s = store();
  let id = s?.getItem(SID_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    s?.setItem(SID_KEY, id);
  }
  return id;
}

// First touch of this visit wins; a new campaign click overrides it.
export function captureAttribution() {
  const s = store();
  if (!s) return;
  const q = new URLSearchParams(window.location.search);
  const fresh = {};
  PARAMS.forEach((k) => q.get(k) && (fresh[k] = q.get(k).slice(0, 150)));
  const existing = JSON.parse(s.getItem(ATTR_KEY) || "null");
  if (existing && !Object.keys(fresh).length) return;
  let ref = "";
  try {
    const r = document.referrer && new URL(document.referrer);
    if (r && r.host !== window.location.host) ref = r.host;
  } catch {}
  s.setItem(ATTR_KEY, JSON.stringify({ ...fresh, referrer: ref, landing_page: window.location.pathname }));
}

export const getAttribution = () => {
  try {
    return JSON.parse(store()?.getItem(ATTR_KEY) || "{}");
  } catch {
    return {};
  }
};

export function pushEvent(event, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

// First-party, cookieless analytics beacon.
export function beacon(event = "pageview", extra = {}) {
  if (navigator.webdriver) return;
  const a = getAttribution();
  const body = JSON.stringify({
    e: event,
    p: window.location.pathname,
    r: a.referrer || "",
    us: a.utm_source || (a.gclid || a.gbraid || a.wbraid ? "google-ads" : a.fbclid ? "meta-ads" : a.msclkid ? "microsoft-ads" : ""),
    um: a.utm_medium || "",
    uc: a.utm_campaign || "",
    w: window.innerWidth,
    l: document.documentElement.lang,
    s: sessionId(),
    ...extra,
  });
  try {
    if (navigator.sendBeacon) navigator.sendBeacon("/api/t.php", new Blob([body], { type: "application/json" }));
    else fetch("/api/t.php", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
  } catch {}
}
