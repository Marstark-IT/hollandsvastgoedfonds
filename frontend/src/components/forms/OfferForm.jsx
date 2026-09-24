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

// Full lead form for the dedicated offer page: three steps (property, wishes,
// contact). Big targets, labels above fields, one question group per screen.
export default function OfferForm({ locale }) {
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
    type: "", address: "", postcode: "", city: "", occupancy: "", units: "", condition: "",
    timeframe: "", price: "", message: "",
    name: "", email: "", phone: "", contactPref: "telefoon", consent: false, company: "",
  });

  const set = (k) => (e) => {
    if (!started.current) {
      started.current = true;
      pushEvent("form_start", { form_source: "offer-page" });
      beacon("form_start");
    }
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setV((s) => ({ ...s, [k]: value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const go = (n) => {
    setStep(n);
    pushEvent(`form_step_${n}`, { form_source: "offer-page", lead_type: v.type });
    requestAnimationFrame(() => {
      topRef.current?.focus();
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const validate = (n) => {
    const err = {};
    if (n === 1) {
      if (!v.type) err.type = c.errors.type;
      if (v.postcode.trim().length < 4 && v.city.trim().length < 2) err.place = c.errors.place;
      if (!v.occupancy) err.occupancy = c.errors.occupancy;
    }
    if (n === 2 && !v.timeframe) err.timeframe = c.errors.timeframe;
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
        locale, source: "offer-page", page: window.location.pathname, attribution: getAttribution(),
      });
      try {
        sessionStorage.setItem("hvf_lead", JSON.stringify({ type: v.type, source: "offer-page" }));
      } catch {}
      beacon("lead", { lt: v.type });
      router.push(href("thanks", locale));
    } catch {
      setStatus("error");
    }
  };

  const err = (k) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} className="mt-1.5 text-[0.9rem] font-semibold text-[#B42318]">{errors[k]}</p>
    ) : null;
  const aria = (k) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${id}-${k}-err` : undefined });
  const opt = (label) => (
    <span className="ml-1 text-[0.85rem] font-normal text-muted">({c.optional})</span>
  );

  // Radio pills used for occupancy, condition, timeframe and contact preference.
  const Pills = ({ name, options, cols = "sm:grid-cols-2" }) => (
    <div className={`mt-2 grid grid-cols-1 gap-2.5 ${cols}`} role="radiogroup" {...aria(name)}>
      {Object.entries(options).map(([key, label]) => {
        const active = v[name] === key;
        return (
          <label
            key={key}
            className={`flex cursor-pointer items-center gap-3 rounded border-2 px-4 py-3 font-semibold transition-colors ${
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

  return (
    <div className="rounded bg-white p-6 shadow-card md:p-10">
      {/* Step indicator */}
      <ol className="grid grid-cols-3 gap-2" aria-label={c.stepOf(step, 3)}>
        {c.steps.map((label, i) => {
          const n = i + 1;
          const state = n < step ? "done" : n === step ? "now" : "todo";
          return (
            <li key={label} className="min-w-0">
              <div className={`h-1.5 rounded ${state === "todo" ? "bg-soft" : "bg-accent"}`} />
              <p className={`mt-2 truncate text-[0.85rem] font-semibold ${state === "now" ? "text-brand" : "text-muted"}`}>
                <span className="mr-1">{n}.</span>
                <span className={state === "now" ? "" : "hidden sm:inline"}>{label}</span>
              </p>
            </li>
          );
        })}
      </ol>

      <h2 ref={topRef} tabIndex={-1} className="mt-8 scroll-mt-32 text-[1.6rem] focus:outline-none md:text-[1.85rem]">
        {c.steps[step - 1]}
      </h2>

      {step === 1 && (
        <form onSubmit={next} noValidate className="mt-6 space-y-6">
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

          <div>
            <label htmlFor={`${id}-address`} className="label">{c.f.address} {opt()}</label>
            <input id={`${id}-address`} className="field" value={v.address} onChange={set("address")} autoComplete="street-address" />
          </div>
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

          <fieldset>
            <legend className="label">{c.f.occupancy}</legend>
            <Pills name="occupancy" options={c.f.occupancyOpts} />
            {err("occupancy")}
          </fieldset>

          {v.type === "portefeuille" && (
            <div>
              <label htmlFor={`${id}-units`} className="label">{c.f.units} {opt()}</label>
              <input id={`${id}-units`} type="number" min="1" max="9999" inputMode="numeric" className="field max-w-[200px]" value={v.units} onChange={set("units")} />
            </div>
          )}

          <fieldset>
            <legend className="label">{c.f.condition} {opt()}</legend>
            <Pills name="condition" options={c.f.conditionOpts} cols="grid-cols-2 sm:grid-cols-4" />
          </fieldset>

          <button type="submit" className="btn w-full text-[1.05rem] sm:w-auto sm:px-10">
            {c.next}
            <ArrowRight size={20} weight="bold" />
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={next} noValidate className="mt-6 space-y-6">
          <fieldset>
            <legend className="label">{c.f.timeframe}</legend>
            <Pills name="timeframe" options={c.f.timeframeOpts} />
            {err("timeframe")}
          </fieldset>
          <div>
            <label htmlFor={`${id}-price`} className="label">{c.f.price} {opt()}</label>
            <input id={`${id}-price`} className="field max-w-[320px]" value={v.price} onChange={set("price")} inputMode="text" />
          </div>
          <div>
            <label htmlFor={`${id}-message`} className="label">{c.f.message} {opt()}</label>
            <textarea id={`${id}-message`} rows={4} className="field resize-y" value={v.message} onChange={set("message")} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => go(1)} className="btn-outline">
              <ArrowLeft size={20} weight="bold" />
              {c.back}
            </button>
            <button type="submit" className="btn flex-1 text-[1.05rem] sm:flex-none sm:px-10">
              {c.next}
              <ArrowRight size={20} weight="bold" />
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={submit} noValidate className="mt-6 space-y-5">
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
            <Pills name="contactPref" options={c.f.contactOpts} cols="grid-cols-2" />
          </fieldset>

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

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button type="button" onClick={() => go(2)} className="btn-outline">
              <ArrowLeft size={20} weight="bold" />
              {c.back}
            </button>
            <button type="submit" disabled={status === "sending"} className="btn flex-1 text-[1.05rem] disabled:opacity-70 sm:flex-none sm:px-10">
              {status === "sending" ? c.sending : c.submit}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
