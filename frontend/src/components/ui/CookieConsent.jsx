"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GTM_ID } from "@/lib/env";
import { href } from "@/data/site";

const COPY = {
  nl: {
    title: "Cookies",
    text: "Wij gebruiken analytische en marketingcookies om de website te verbeteren en advertenties te meten. Alleen met uw toestemming.",
    accept: "Alles accepteren",
    reject: "Alleen noodzakelijk",
    settings: "Instellingen",
    save: "Keuze opslaan",
    analytics: "Analytische cookies",
    marketing: "Marketingcookies",
    more: "Cookieverklaring",
  },
  en: {
    title: "Cookies",
    text: "We use analytics and marketing cookies to improve the website and measure advertising. Only with your consent.",
    accept: "Accept all",
    reject: "Necessary only",
    settings: "Settings",
    save: "Save choice",
    analytics: "Analytics cookies",
    marketing: "Marketing cookies",
    more: "Cookie statement",
  },
};

function apply(c) {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  const m = c.m ? "granted" : "denied";
  gtag("consent", "update", { ad_storage: m, ad_user_data: m, ad_personalization: m, analytics_storage: c.a ? "granted" : "denied" });
  window.dataLayer.push({ event: "consent_update", consent_analytics: c.a, consent_marketing: c.m });
}

// Only rendered when a GTM container is configured: without marketing tags the
// site sets no cookies and needs no banner. Footer link "Cookie-instellingen"
// reopens it via the `hvf:cookies` event.
export default function CookieConsent({ locale }) {
  const t = COPY[locale];
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [a, setA] = useState(false);
  const [m, setM] = useState(false);

  useEffect(() => {
    if (!GTM_ID) return;
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem("hvf_consent") || "null");
    } catch {}
    if (!saved) setOpen(true);
    else {
      setA(!!saved.a);
      setM(!!saved.m);
    }
    const reopen = () => {
      setDetails(true);
      setOpen(true);
    };
    window.addEventListener("hvf:cookies", reopen);
    return () => window.removeEventListener("hvf:cookies", reopen);
  }, []);

  if (!GTM_ID || !open) return null;

  const save = (c) => {
    try {
      localStorage.setItem("hvf_consent", JSON.stringify({ ...c, ts: Date.now() }));
    } catch {}
    apply(c);
    setOpen(false);
  };

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="cc-title" className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-[560px] rounded border border-line bg-white p-6 shadow-card sm:inset-x-auto sm:right-5 sm:bottom-5">
      <h2 id="cc-title" className="text-[1.25rem]">{t.title}</h2>
      <p className="mt-2 text-[0.98rem] text-muted">
        {t.text}{" "}
        <Link href={href("cookies", locale)} className="font-semibold text-brand underline">{t.more}</Link>
      </p>
      {details && (
        <div className="mt-4 space-y-3">
          {[[t.analytics, a, setA], [t.marketing, m, setM]].map(([label, val, set]) => (
            <label key={label} className="flex cursor-pointer items-center justify-between gap-4 rounded border border-line px-4 py-3 font-semibold">
              {label}
              <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} className="h-5 w-5 accent-[#B45208]" />
            </label>
          ))}
        </div>
      )}
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={() => save({ a: true, m: true })} className="btn flex-1 px-5 py-3">{t.accept}</button>
        <button type="button" onClick={() => save({ a: false, m: false })} className="btn-outline flex-1 px-5 py-2.5">{t.reject}</button>
        {details ? (
          <button type="button" onClick={() => save({ a, m })} className="w-full py-2 font-semibold text-brand underline">{t.save}</button>
        ) : (
          <button type="button" onClick={() => setDetails(true)} className="w-full py-2 font-semibold text-brand underline">{t.settings}</button>
        )}
      </div>
    </div>
  );
}

export function CookieSettingsLink({ label }) {
  if (!GTM_ID) return null;
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event("hvf:cookies"))} className="text-left text-white/80 hover:text-white hover:underline">
      {label}
    </button>
  );
}
