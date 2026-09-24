import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import PageHero from "@/components/sections/PageHero";
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
          <div className="rounded bg-band p-8 text-white md:p-10">
            <EnvelopeSimple size={44} weight="light" />
            <h2 className="mt-5 text-[1.5rem] text-white">{p.emailLabel}</h2>
            <a href={COMPANY.emailHref} className="mt-3 block break-all text-[1.25rem] font-bold underline">
              {COMPANY.email}
            </a>
          </div>
          <div id="aanbieden">
            <LeadForm locale={locale} source="contact" />
          </div>
        </div>
      </section>
    </>
  );
}
