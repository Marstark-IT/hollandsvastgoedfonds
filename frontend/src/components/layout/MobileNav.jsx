"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import LangSwitch from "@/components/layout/LangSwitch";

export default function MobileNav({ locale, items, cta, labels }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex h-12 w-12 items-center justify-center rounded text-brand"
      >
        {open ? <X size={30} weight="bold" /> : <List size={30} weight="bold" />}
        <span className="sr-only">{open ? labels.close : labels.menu}</span>
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[76px] z-40 overflow-y-auto bg-white"
      >
        <nav className="wrap flex flex-col py-6">
          {items.map((item) => (
            <div key={item.href} className="border-b border-line">
              <Link href={item.href} className="block py-4 text-[1.2rem] font-semibold text-brand">
                {item.label}
              </Link>
              {item.children && (
                <ul className="pb-3 pl-4">
                  {item.children.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} className="block py-2 text-[1.05rem] text-muted">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <div className="mt-6 flex items-center justify-between gap-4">
            <LangSwitch locale={locale} className="text-[1.1rem]" />
            <Link href={cta.href} className="btn">
              {cta.label}
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
