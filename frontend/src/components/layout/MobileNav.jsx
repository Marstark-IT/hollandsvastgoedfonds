"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X, CaretDown, EnvelopeSimple, ArrowRight } from "@phosphor-icons/react";
import LangSwitch from "@/components/layout/LangSwitch";
import Logo from "@/components/ui/Logo";
import { COMPANY } from "@/data/site";

// Off-canvas drawer for phones and tablets: slides in from the right over a
// dimmed backdrop. Closes on Escape, backdrop tap, route change or the close
// button; focus moves into the drawer and back to the trigger; the page behind
// cannot scroll while it is open.
export default function MobileNav({ locale, items, cta, labels }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const trigger = useRef(null);
  const closeBtn = useRef(null);
  const panel = useRef(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const html = document.documentElement;
    if (open) {
      const sw = window.innerWidth - html.clientWidth;
      html.style.overflow = "hidden";
      if (sw) html.style.paddingRight = `${sw}px`;
      requestAnimationFrame(() => closeBtn.current?.focus());
    } else {
      html.style.overflow = "";
      html.style.paddingRight = "";
    }
    const onKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll("a[href], button, summary");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = "";
      html.style.paddingRight = "";
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  return (
    <div className="xl:hidden">
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-drawer"
        className="inline-flex h-12 w-12 items-center justify-center rounded text-brand hover:bg-soft"
      >
        <List size={30} weight="bold" />
        <span className="sr-only">{labels.menu}</span>
      </button>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-[80] bg-ink/55 transition-opacity duration-300 motion-reduce:transition-none ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        id="mobile-drawer"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={labels.menu}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-[90] flex h-[100dvh] w-[88vw] max-w-[400px] flex-col bg-white shadow-[-20px_0_60px_-20px_rgba(10,43,70,0.45)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-line px-5">
          <Logo className="h-10 w-auto" />
          <button
            ref={closeBtn}
            type="button"
            onClick={close}
            className="inline-flex h-12 w-12 items-center justify-center rounded text-brand hover:bg-soft"
          >
            <X size={28} weight="bold" />
            <span className="sr-only">{labels.close}</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label={labels.menu}>
          <ul>
            {items.map((item, i) => (
              <li
                key={item.href}
                className={`border-b border-line transition-all duration-300 motion-reduce:transition-none ${
                  open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              >
                {item.children ? (
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[1.2rem] font-semibold text-brand [&::-webkit-details-marker]:hidden">
                      {item.label}
                      <CaretDown size={20} weight="bold" className="text-accent transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <ul className="pb-3 pl-3">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block rounded px-3 py-2.5 text-[1.05rem] text-ink hover:bg-soft hover:text-accent">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link href={item.href} className="block py-4 text-[1.2rem] font-semibold text-brand hover:text-accent">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 space-y-4 border-t border-line bg-soft px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
          <Link href={cta.href} className="btn w-full text-[1.05rem]">
            {cta.label}
            <ArrowRight size={20} weight="bold" />
          </Link>
          <div className="flex items-center justify-between gap-4">
            <a href={COMPANY.emailHref} className="inline-flex min-w-0 items-center gap-2 text-[0.95rem] font-semibold text-brand">
              <EnvelopeSimple size={20} className="shrink-0" />
              <span className="truncate">{COMPANY.email}</span>
            </a>
            <LangSwitch locale={locale} className="shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
