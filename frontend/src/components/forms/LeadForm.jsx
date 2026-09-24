"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { House, Buildings, Storefront, Warehouse, DotsThreeOutline, ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { submitLead } from "@/lib/api";
import { beacon, getAttribution, pushEvent } from "@/lib/tracking";
import { COMPANY, href } from "@/data/site";
import { t } from "@/data/content";

const TYPES = [
  ["woning", House],
  ["portefeuille", Buildings],
  ["commercieel", Storefront],
  ["bedrijf", Warehouse],
  ["anders", DotsThreeOutline],
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneOk = (v) => {
  const digits = v.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
};

// Two short steps: what and where, then who. Fewer fields per screen keeps the
// form easy for older visitors and lifts completion.
export default function LeadForm({ locale, source = "hero", titleAs: Title = "h2" }) {
  const c = t(locale).form;
  const id = useId();
  const router = useRouter();
  const topRef = useRef(null);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [v, setV] = useState({
    type: "",
    location: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    consent: false,
    company: "",
  });

  const started = useRef(false);
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

  const next = (e) => {
    e.preventDefault();
    const err = {};
    if (!v.type) err.type = c.errors.type;
    if (v.location.trim().length < 2) err.location = c.errors.location;
    setErrors(err);
    if (Object.keys(err).length === 0) {
      setStep(2);
      pushEvent("form_step_2", { form_source: source, lead_type: v.type });
      topRef.current?.focus();
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (v.name.trim().length < 2) err.name = c.errors.name;
    if (!EMAIL_RE.test(v.email.trim())) err.email = c.errors.email;
    if (!phoneOk(v.phone)) err.phone = c.errors.phone;
    if (!v.consent) err.consent = c.errors.consent;
    setErrors(err);
    if (Object.keys(err).length) return;

    setStatus("sending");
    try {
      await submitLead({ ...v, locale, source, page: window.location.pathname, attribution: getAttribution() });
      try {
        sessionStorage.setItem("hvf_lead", JSON.stringify({ type: v.type, source }));
      } catch {}
      beacon("lead", { lt: v.type });
      router.push(href("thanks", locale));
    } catch {
      setStatus("error");
    }
  };

  const fieldError = (k) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} className="mt-1.5 text-[0.9rem] font-semibold text-[#B42318]">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${id}-${k}-err` : undefined });

  return (
    <div className="rounded bg-white p-6 shadow-card md:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <Title ref={topRef} tabIndex={-1} className="text-[1.5rem] md:text-[1.65rem] focus:outline-none">
          {c.title}
        </Title>
        <span className="shrink-0 text-[0.85rem] font-semibold text-muted">{c.stepOf(step, 2)}</span>
      </div>
      <div className="mt-4 h-1.5 w-full rounded bg-soft" aria-hidden="true">
        <div className="h-1.5 rounded bg-accent transition-all duration-300" style={{ width: step === 1 ? "50%" : "100%" }} />
      </div>

      {step === 1 ? (
        <form onSubmit={next} noValidate className="mt-6">
          <fieldset>
            <legend className="label">{c.typeLabel}</legend>
            <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2" role="radiogroup" {...aria("type")}>
              {TYPES.map(([key, Icon]) => {
                const active = v.type === key;
                return (
                  <label
                    key={key}
                    className={`flex cursor-pointer items-center gap-3 rounded border-2 px-4 py-3 transition-colors ${
                      active ? "border-accent bg-accent/5 text-ink" : "border-line text-ink hover:border-brand/50"
                    } ${key === "anders" ? "sm:col-span-2" : ""}`}
                  >
                    <input type="radio" name="type" value={key} checked={active} onChange={set("type")} className="sr-only" />
                    <Icon size={26} weight={active ? "fill" : "regular"} className={`shrink-0 ${active ? "text-accent" : "text-band"}`} />
                    <span className="font-semibold leading-snug">{c.types[key]}</span>
                  </label>
                );
              })}
            </div>
            {fieldError("type")}
          </fieldset>

          <div className="mt-5">
            <label htmlFor={`${id}-location`} className="label">
              {c.locationLabel}
            </label>
            <input
              id={`${id}-location`}
              className="field"
              value={v.location}
              onChange={set("location")}
              autoComplete="postal-code"
              {...aria("location")}
            />
            {fieldError("location")}
          </div>

          <button type="submit" className="btn mt-6 w-full text-[1.05rem]">
            {c.next}
            <ArrowRight size={20} weight="bold" />
          </button>
        </form>
      ) : (
        <form onSubmit={submit} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor={`${id}-name`} className="label">{c.name}</label>
            <input id={`${id}-name`} className="field" value={v.name} onChange={set("name")} autoComplete="name" {...aria("name")} />
            {fieldError("name")}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-email`} className="label">{c.email}</label>
              <input id={`${id}-email`} type="email" className="field" value={v.email} onChange={set("email")} autoComplete="email" {...aria("email")} />
              {fieldError("email")}
            </div>
            <div>
              <label htmlFor={`${id}-phone`} className="label">{c.phone}</label>
              <input id={`${id}-phone`} type="tel" className="field" value={v.phone} onChange={set("phone")} autoComplete="tel" {...aria("phone")} />
              {fieldError("phone")}
            </div>
          </div>
          <div>
            <label htmlFor={`${id}-message`} className="label">{c.message}</label>
            <textarea id={`${id}-message`} rows={3} className="field resize-y" value={v.message} onChange={set("message")} />
          </div>

          {/* Honeypot: hidden from people, filled in by bots. */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor={`${id}-company`}>Company</label>
            <input id={`${id}-company`} tabIndex={-1} autoComplete="off" value={v.company} onChange={set("company")} />
          </div>

          <div>
            <label className="flex cursor-pointer items-start gap-3 text-[0.95rem] text-ink">
              <input
                type="checkbox"
                checked={v.consent}
                onChange={set("consent")}
                className="mt-1 h-5 w-5 shrink-0 accent-[#B45208]"
                {...aria("consent")}
              />
              <span>
                {c.consent}{" "}
                <Link href={href("privacy", locale)} className="font-semibold text-brand underline" target="_blank">
                  {c.privacy}
                </Link>
                .
              </span>
            </label>
            {fieldError("consent")}
          </div>

          {status === "error" && (
            <p role="alert" className="rounded border border-[#B42318]/30 bg-[#FEF3F2] p-3 text-[0.95rem] text-[#B42318]">
              {c.errors.server}{" "}
              <a href={COMPANY.emailHref} className="font-semibold underline">{COMPANY.email}</a>.
            </p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button type="button" onClick={() => setStep(1)} className="btn-outline px-4" aria-label={c.back}>
              <ArrowLeft size={20} weight="bold" />
            </button>
            <button type="submit" disabled={status === "sending"} className="btn flex-1 text-[1.05rem] disabled:opacity-70">
              {status === "sending" ? c.sending : c.submit}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
