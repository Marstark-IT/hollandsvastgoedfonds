"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "@phosphor-icons/react";
import { routeKeyFor, switchTarget } from "@/lib/i18n";
import { t } from "@/data/content";

export default function LangSwitch({ locale, className = "" }) {
  const other = locale === "nl" ? "en" : "nl";
  const key = routeKeyFor(usePathname());
  const c = t(locale);
  return (
    <Link
      href={switchTarget(key, other)}
      hrefLang={other === "nl" ? "nl-NL" : "en-GB"}
      lang={other}
      className={`inline-flex items-center gap-1.5 font-semibold text-brand hover:text-accent ${className}`}
    >
      <Globe size={20} weight="bold" aria-hidden="true" />
      <span aria-hidden="true">{c.langShort}</span>
      <span className="sr-only">{c.langLabel}</span>
    </Link>
  );
}
