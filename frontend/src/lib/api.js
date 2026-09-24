// Posts a lead to the PHP intake endpoint that ships next to the static site
// (public/api/lead.php). A per-submission id makes retries idempotent.
export async function submitLead(payload) {
  const submissionId =
    typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());

  const res = await fetch("/api/lead.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, submissionId }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw new Error(data.error || "request failed");
  return data;
}
