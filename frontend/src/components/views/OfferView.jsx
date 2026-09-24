import { CheckCircle, EnvelopeSimple, LockKey } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { JsonLd, breadcrumbLd } from "@/lib/seo";
import { t } from "@/data/content";
import LeadForm from "@/components/forms/LeadForm";
import { COMPANY, href } from "@/data/site";
import { o } from "@/data/offer";
import { x } from "@/data/extra";
import FaqAccordion from "@/components/sections/FaqAccordion";
import { faqLd } from "@/lib/seo";

// Dedicated lead page: the full form with a quiet trust column. No other
// sections, so nothing distracts from finishing the form.
export default function OfferView({ locale }) {
  const c = o(locale);
  const faqItems = [...x(locale).faqGroups[1].items, ...x(locale).faqGroups[3].items];
  return (
    <>
      <JsonLd data={breadcrumbLd(locale, [{ key: "offer", label: c.title }])} />
      <section className="bg-soft pb-16 pt-8 md:pb-24 md:pt-12">
        <div className="wrap grid items-start gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div className="min-w-0">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 text-[0.9rem] text-muted">
                <li><Link href={href("home", locale)} className="hover:text-accent hover:underline">{t(locale).nav.home}</Link></li>
                <li className="inline-flex items-center gap-1.5"><CaretRight size={12} weight="bold" /><span aria-current="page" className="font-semibold text-ink">{c.title}</span></li>
              </ol>
            </nav>
            <h1 className="rise mt-4 text-[2rem] leading-tight md:text-[2.6rem]">{c.title}</h1>
            <p className="rise rise-2 mb-8 mt-3 text-[1.15rem] text-muted">{c.text}</p>
            <LeadForm locale={locale} source="offer-page" variant="page" />
          </div>
          <aside className="space-y-5 lg:sticky lg:top-28 lg:mt-[7.5rem]">
            <div className="rounded bg-white p-7">
              <h2 className="text-[1.25rem]">{c.aside.title}</h2>
              <ul className="mt-5 space-y-3.5">
                {c.aside.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 font-medium">
                    <CheckCircle size={24} weight="fill" className="shrink-0 text-band" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded bg-band p-7 text-white">
              <h2 className="text-[1.2rem] text-white">{c.aside.nextTitle}</h2>
              <ol className="mt-4 space-y-3">
                {c.aside.next.map((p, i) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[0.9rem] font-bold text-accent">{i + 1}</span>
                    <span className="text-white/95">{p}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded border border-line bg-white p-7">
              <p className="flex items-start gap-3 text-[0.95rem] text-muted">
                <LockKey size={22} className="mt-0.5 shrink-0 text-band" />
                {c.aside.privacy}
              </p>
              <p className="mt-5 font-semibold text-brand">{c.aside.question}</p>
              <a href={COMPANY.emailHref} className="mt-1 inline-flex items-start gap-2 font-semibold text-accent hover:underline">
                <EnvelopeSimple size={20} className="mt-0.5 shrink-0" />
                <span>
                  {COMPANY.email.split("@")[0]}@<wbr />
                  {COMPANY.email.split("@")[1]}
                </span>
              </a>
            </div>
          </aside>
        </div>
      </section>
      <FaqAccordion locale={locale} items={faqItems} title={x(locale).faqGroups[1].title} />
      <JsonLd data={faqLd(faqItems)} />
    </>
  );
}
