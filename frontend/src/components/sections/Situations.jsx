import Link from "next/link";
import { House, Buildings, Scroll, Key, Warehouse, Wrench, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { articlePath } from "@/data/articles";
import { x } from "@/data/extra";

const ICONS = { house: House, buildings: Buildings, scroll: Scroll, key: Key, warehouse: Warehouse, wrench: Wrench };

// Common seller situations, each linking to the matching knowledge-base article.
export default function Situations({ locale, tone = "white" }) {
  const s = x(locale).situations;
  return (
    <section className={`${tone === "soft" ? "bg-soft" : ""} py-20 md:py-28`}>
      <div className="wrap">
        <h2 className="h-section">{s.title}</h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {s.items.map((it) => {
            const Icon = ICONS[it.icon];
            return (
              <li key={it.title}>
                <Link
                  href={articlePath(it.article)}
                  className={`group flex h-full flex-col rounded border border-line p-7 transition-colors hover:border-band ${tone === "soft" ? "bg-white" : "bg-white"}`}
                >
                  <Icon size={40} weight="light" className="text-band" />
                  <h3 className="mt-5 text-[1.3rem]">{it.title}</h3>
                  <p className="mt-2 flex-1 text-muted">{it.text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-bold text-accent">
                    {s.more}
                    <ArrowRight size={18} weight="bold" className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
