import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { href } from "@/data/site";
import { t } from "@/data/content";

// Native <details>: works without JS and every answer stays in the HTML for SEO.
// Pass `items`/`title` for page-specific questions; defaults to the general FAQ.
export default function FaqAccordion({ locale, limit, heading = true, items, title, tone = "white" }) {
  const c = t(locale);
  const all = items || c.faq;
  const list = limit ? all.slice(0, limit) : all;
  return (
    <section className={`${tone === "soft" ? "bg-soft" : ""} py-20 md:py-28`}>
      <div className="wrap max-w-[900px]">
        {heading && <h2 className="h-section text-center">{title || c.faqPreview.title}</h2>}
        <FaqList items={list} className={heading ? "mt-10" : ""} />
        {limit && (
          <div className="mt-10 text-center">
            <Link href={href("faq", locale)} className="btn-outline">
              {c.faqPreview.all}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function FaqList({ items, className = "" }) {
  return (
    <div className={`divide-y divide-line border-y border-line ${className}`}>
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[1.15rem] font-bold text-brand md:text-[1.2rem] [&::-webkit-details-marker]:hidden">
            {f.q}
            <Plus size={24} weight="bold" className="shrink-0 text-accent transition-transform duration-200 group-open:rotate-45" />
          </summary>
          <p className="max-w-[70ch] pb-6 text-[1.05rem] text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
