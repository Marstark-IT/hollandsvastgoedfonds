"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "@phosphor-icons/react";
import { ROUTES } from "@/data/site";
import { routeKeyFor } from "@/lib/i18n";
import { t } from "@/data/content";

export default function LangSwitch({ locale, className = "" }) {
  const other = locale === "nl" ? "en" : "nl";
  const key = routeKeyFor(usePathname());
  const c = t(locale);
  return (
    <Link
      href={ROUTES[key][other]}
      hrefLang={other === "nl" ? "nl-NL" : "en-GB"}
      lang={other}
      className={`inline-flex items-center gap-1.5 font-semibold text-brand hover:text-accent ${className}`}
      aria-label={c.langLabel}
    >
      <Globe size={20} weight="bold" />
      {c.langShort}
    </Link>
  );
}
