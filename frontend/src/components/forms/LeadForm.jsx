"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { House, Buildings, Storefront, Warehouse, DotsThreeOutline, ArrowLeft, ArrowRight, Check } from "@phosphor-icons/react";
import { submitLead } from "@/lib/api";
import { beacon, getAttribution, pushEvent } from "@/lib/tracking";
import { COMPANY, href } from "@/data/site";
import { t } from "@/data/content";
import { o } from "@/data/offer";

const TYPES = [
  ["woning", House],
  ["portefeuille", Buildings],
  ["commercieel", Storefront],
  ["bedrijf", Warehouse],
  ["anders", DotsThreeOutline],
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneOk = (v) => {
  const d = v.replace(/\D/g, "");
  return d.length >= 9 && d.length <= 15;
};

// The one lead form used everywhere on the site (hero, form sections, segment,
// city, article, contact and offer pages). Same three steps and fields in every
// placement, so every lead reaches the database and the CRM in one shape:
//   1. Het object  - type, postcode, plaats (short: fits the hero)
//   2. Details     - verhuurd?, aantal, staat, termijn, adres, prijsidee
//   3. Gegevens    - naam, e-mail, telefoon, contactvoorkeur, toelichting, akkoord
// `variant="page"` hides the card title (the page has its own H1).
export default function LeadForm({ locale, source = "form", variant = "card" }) {
  const c = o(locale);
  const base = t(locale).form;
  const id = useId();
  const router = useRouter();
  const topRef = useRef(null);
  const started = useRef(false);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [v, setV] = useState({
    type: "", postcode: "", city: "",
    occupancy: "", units: "", condition: "", timeframe: "", address: "", price: "",
    name: "", email: "", phone: "", contactPref: "telefoon", message: "", consent: false, company: "",
  });

  const set = (k) => (e) => {
    if (!started.current) {
      started.current = true;
      pushEvent("form_start", { form_source: source });
      beacon("form_start");
    }
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setV((s) => ({ ...s, [k]: value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const go = (n) => {
    setStep(n);
    pushEvent(`form_step_${n}`, { form_source: source, lead_type: v.type });
    requestAnimationFrame(() => {
      topRef.current?.focus({ preventScroll: true });
      const r = topRef.current?.getBoundingClientRect();
      if (r && (r.top < 90 || r.top > window.innerHeight * 0.6)) topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const validate = (n) => {
    const err = {};
    if (n === 1) {
      if (!v.type) err.type = c.errors.type;
      if (v.postcode.trim().length < 4 && v.city.trim().length < 2) err.place = c.errors.place;
    }
    if (n === 2) {
      if (!v.occupancy) err.occupancy = c.errors.occupancy;
      if (!v.timeframe) err.timeframe = c.errors.timeframe;
    }
    if (n === 3) {
      if (v.name.trim().length < 2) err.name = base.errors.name;
      if (!EMAIL_RE.test(v.email.trim())) err.email = base.errors.email;
      if (!phoneOk(v.phone)) err.phone = base.errors.phone;
      if (!v.consent) err.consent = base.errors.consent;
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const next = (e) => {
    e.preventDefault();
    if (validate(step)) go(step + 1);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate(3)) return;
    setStatus("sending");
    const location = [v.postcode.trim().toUpperCase(), v.city.trim()].filter(Boolean).join(" ");
    try {
      await submitLead({
        type: v.type, location, address: v.address, occupancy: v.occupancy, units: v.units, condition: v.condition,
        timeframe: v.timeframe, price: v.price, message: v.message, name: v.name, email: v.email, phone: v.phone,
        contactPref: v.contactPref, consent: v.consent, company: v.company,
        locale, source, page: window.location.pathname, attribution: getAttribution(),
      });
      try {
        sessionStorage.setItem("hvf_lead", JSON.stringify({ type: v.type, source }));
      } catch {}
      beacon("lead", { lt: v.type });
      router.push(href("thanks", locale));
    } catch {
      setStatus("error");
    }
  };

  const err = (k) =>
    errors[k] ? <p id={`${id}-${k}-err`} className="mt-1.5 text-[0.9rem] font-semibold text-[#B42318]">{errors[k]}</p> : null;
  const aria = (k) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${id}-${k}-err` : undefined });
  const opt = <span className="ml-1 text-[0.85rem] font-normal text-muted">({c.optional})</span>;

  const pills = (name, options, cols = "sm:grid-cols-2") => (
    <div className={`mt-2 grid grid-cols-1 gap-2.5 ${cols}`} role="radiogroup" {...aria(name)}>
      {Object.entries(options).map(([key, label]) => {
        const active = v[name] === key;
        return (
          <label
            key={key}
            className={`flex cursor-pointer items-center gap-3 rounded border-2 px-4 py-3 font-semibold leading-snug transition-colors ${
              active ? "border-accent bg-accent/5" : "border-line hover:border-brand/50"
            }`}
          >
            <input type="radio" name={`${id}-${name}`} value={key} checked={active} onChange={set(name)} className="sr-only" />
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${active ? "border-accent bg-accent" : "border-line"}`}>
              {active && <Check size={12} weight="bold" className="text-white" />}
            </span>
            {label}
          </label>
        );
      })}
    </div>
  );

  const backBtn = (to) => (
    <button type="button" onClick={() => go(to)} className="btn-outline px-4" aria-label={c.back}>
      <ArrowLeft size={20} weight="bold" />
      <span className="hidden sm:inline">{c.back}</span>
    </button>
  );

  return (
    <div className={`rounded bg-white shadow-card ${variant === "page" ? "p-6 md:p-10" : "p-6 md:p-8"}`}>
      {variant === "card" && (
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <p className="text-[1.5rem] font-bold leading-tight text-brand md:text-[1.65rem]">{base.title}</p>
          <span className="shrink-0 text-[0.85rem] font-semibold text-muted">{c.stepOf(step, 3)}</span>
        </div>
      )}

      <ol className="grid grid-cols-3 gap-2" aria-label={c.stepOf(step, 3)}>
        {c.steps.map((label, i) => {
          const n = i + 1;
          const state = n < step ? "done" : n === step ? "now" : "todo";
          return (
            <li key={label} className="min-w-0">
              <div className={`h-1.5 rounded transition-colors duration-300 ${state === "todo" ? "bg-soft" : "bg-accent"}`} />
              <p className={`mt-2 truncate text-[0.82rem] font-semibold ${state === "now" ? "text-brand" : "text-muted"}`}>
                <span className="mr-1">{n}.</span>
                <span className={state === "now" ? "" : variant === "page" ? "hidden sm:inline" : "hidden"}>{label}</span>
              </p>
            </li>
          );
        })}
      </ol>

      <h2 ref={topRef} tabIndex={-1} className={`scroll-mt-32 focus:outline-none ${variant === "page" ? "mt-8 text-[1.6rem] md:text-[1.85rem]" : "sr-only"}`}>
        {c.steps[step - 1]}
      </h2>

      {step === 1 && (
        <form onSubmit={next} noValidate className={`space-y-5 ${variant === "page" ? "mt-6" : "mt-5"}`}>
          <fieldset>
            <legend className="label">{c.f.type}</legend>
            <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2" role="radiogroup" {...aria("type")}>
              {TYPES.map(([key, Icon]) => {
                const active = v.type === key;
                return (
                  <label
                    key={key}
                    className={`flex cursor-pointer items-center gap-3 rounded border-2 px-4 py-3 transition-colors ${
                      active ? "border-accent bg-accent/5" : "border-line hover:border-brand/50"
                    } ${key === "anders" ? "sm:col-span-2" : ""}`}
                  >
                    <input type="radio" name={`${id}-type`} value={key} checked={active} onChange={set("type")} className="sr-only" />
                    <Icon size={26} weight={active ? "fill" : "regular"} className={`shrink-0 ${active ? "text-accent" : "text-band"}`} />
                    <span className="font-semibold leading-snug">{base.types[key]}</span>
                  </label>
                );
              })}
            </div>
            {err("type")}
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr]">
            <div>
              <label htmlFor={`${id}-postcode`} className="label">{c.f.postcode}</label>
              <input id={`${id}-postcode`} className="field uppercase" value={v.postcode} onChange={set("postcode")} autoComplete="postal-code" {...aria("place")} />
            </div>
            <div>
              <label htmlFor={`${id}-city`} className="label">{c.f.city}</label>
              <input id={`${id}-city`} className="field" value={v.city} onChange={set("city")} autoComplete="address-level2" {...aria("place")} />
            </div>
          </div>
          {err("place")}
          <button type="submit" className="btn w-full text-[1.05rem]">
            {c.next}
            <ArrowRight size={20} weight="bold" />
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={next} noValidate className="mt-5 space-y-5">
          <fieldset>
            <legend className="label">{c.f.occupancy}</legend>
            {pills("occupancy", c.f.occupancyOpts)}
            {err("occupancy")}
          </fieldset>
          {v.type === "portefeuille" && (
            <div>
              <label htmlFor={`${id}-units`} className="label">{c.f.units} {opt}</label>
              <input id={`${id}-units`} type="number" min="1" max="9999" inputMode="numeric" className="field max-w-[200px]" value={v.units} onChange={set("units")} />
            </div>
          )}
          <fieldset>
            <legend className="label">{c.f.timeframe}</legend>
            {pills("timeframe", c.f.timeframeOpts)}
            {err("timeframe")}
          </fieldset>
          <fieldset>
            <legend className="label">{c.f.condition} {opt}</legend>
            {pills("condition", c.f.conditionOpts, "grid-cols-2")}
          </fieldset>
          <div>
            <label htmlFor={`${id}-address`} className="label">{c.f.address} {opt}</label>
            <input id={`${id}-address`} className="field" value={v.address} onChange={set("address")} autoComplete="street-address" />
          </div>
          <div>
            <label htmlFor={`${id}-price`} className="label">{c.f.price} {opt}</label>
            <input id={`${id}-price`} className="field" value={v.price} onChange={set("price")} />
          </div>
          <div className="flex items-center gap-3">
            {backBtn(1)}
            <button type="submit" className="btn flex-1 text-[1.05rem]">
              {c.next}
              <ArrowRight size={20} weight="bold" />
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={submit} noValidate className="mt-5 space-y-5">
          <div>
            <label htmlFor={`${id}-name`} className="label">{c.f.name}</label>
            <input id={`${id}-name`} className="field" value={v.name} onChange={set("name")} autoComplete="name" {...aria("name")} />
            {err("name")}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-email`} className="label">{c.f.email}</label>
              <input id={`${id}-email`} type="email" className="field" value={v.email} onChange={set("email")} autoComplete="email" {...aria("email")} />
              {err("email")}
            </div>
            <div>
              <label htmlFor={`${id}-phone`} className="label">{c.f.phone}</label>
              <input id={`${id}-phone`} type="tel" className="field" value={v.phone} onChange={set("phone")} autoComplete="tel" {...aria("phone")} />
              {err("phone")}
            </div>
          </div>
          <fieldset>
            <legend className="label">{c.f.contactPref}</legend>
            {pills("contactPref", c.f.contactOpts, "grid-cols-2")}
          </fieldset>
          <div>
            <label htmlFor={`${id}-message`} className="label">{c.f.message} {opt}</label>
            <textarea id={`${id}-message`} rows={3} className="field resize-y" value={v.message} onChange={set("message")} />
          </div>

          {/* Honeypot: hidden from people, filled in by bots. */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor={`${id}-company`}>Company</label>
            <input id={`${id}-company`} tabIndex={-1} autoComplete="off" value={v.company} onChange={set("company")} />
          </div>

          <div>
            <label className="flex cursor-pointer items-start gap-3 text-[0.95rem]">
              <input type="checkbox" checked={v.consent} onChange={set("consent")} className="mt-1 h-5 w-5 shrink-0 accent-[#B45208]" {...aria("consent")} />
              <span>
                {base.consent}{" "}
                <Link href={href("privacy", locale)} className="font-semibold text-brand underline" target="_blank">{base.privacy}</Link>.
              </span>
            </label>
            {err("consent")}
          </div>

          {status === "error" && (
            <p role="alert" className="rounded border border-[#B42318]/30 bg-[#FEF3F2] p-3 text-[0.95rem] text-[#B42318]">
              {base.errors.server} <a href={COMPANY.emailHref} className="font-semibold underline">{COMPANY.email}</a>.
            </p>
          )}

          <div className="flex items-center gap-3 pt-1">
            {backBtn(2)}
            <button type="submit" disabled={status === "sending"} className="btn flex-1 text-[1.05rem] disabled:opacity-70">
              {status === "sending" ? c.sending : c.submit}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
