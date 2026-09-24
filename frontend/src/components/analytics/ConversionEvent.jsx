"use client";

import { useEffect } from "react";
import { pushEvent } from "@/lib/tracking";

// Fires generate_lead once per submitted lead on the thank-you page. The form
// stores the lead summary right before redirecting; a page refresh does not
// fire it again because the entry is removed.
export default function ConversionEvent() {
  useEffect(() => {
    let lead = null;
    try {
      lead = JSON.parse(sessionStorage.getItem("hvf_lead") || "null");
      sessionStorage.removeItem("hvf_lead");
    } catch {}
    if (lead) pushEvent("generate_lead", { lead_type: lead.type, form_source: lead.source, currency: "EUR", value: 1 });
  }, []);
  return null;
}
