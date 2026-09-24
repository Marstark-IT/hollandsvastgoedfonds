import { EnvelopeSimple, Clock } from "@phosphor-icons/react/dist/ssr";
import PageHero from "@/components/sections/PageHero";
import NextSteps from "@/components/sections/NextSteps";
import FaqAccordion from "@/components/sections/FaqAccordion";
import LeadForm from "@/components/forms/LeadForm";
import { COMPANY } from "@/data/site";
import { t } from "@/data/content";

export default function ContactView({ locale }) {
  const c = t(locale);
  const p = c.pages.contact;
  return (
    <>
      <PageHero locale={locale} title={p.title} text={p.text} trail={[{ key: "contact", label: p.title }]} />
      <section className="py-16 md:py-24">
        <div className="wrap grid items-start gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="space-y-5">
            <div className="card-fx rounded bg-band p-8 text-white md:p-10">
              <EnvelopeSimple size={44} weight="light" />
              <h2 className="mt-5 text-[1.5rem] text-white">{p.emailLabel}</h2>
              <a href={COMPANY.emailHref} className="mt-3 block break-all text-[1.25rem] font-bold underline">
                {COMPANY.email}
              </a>
            </div>
            <div className="card-fx rounded border border-line bg-white p-8">
              <span className="fx-icon">
                <Clock size={32} weight="light" />
              </span>
              <h2 className="mt-4 text-[1.3rem]">{p.hoursTitle}</h2>
              <p className="mt-2 text-muted">{p.hoursText}</p>
            </div>
          </div>
          <div id="aanbieden">
            <LeadForm locale={locale} source="contact" />
          </div>
        </div>
      </section>
      <section className="pb-16 md:pb-24">
        <div className="wrap">
          <h2 className="h-section">{p.helpTitle}</h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {p.help.map((h) => (
              <li key={h.title} className="card-fx rounded border border-line bg-white p-7">
                <h3 className="text-[1.2rem]">{h.title}</h3>
                <p className="mt-2 text-muted">{h.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <NextSteps locale={locale} />
      <FaqAccordion locale={locale} items={c.faq} limit={6} />
    </>
  );
}
