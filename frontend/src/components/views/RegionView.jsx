import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import PageHero from "@/components/sections/PageHero";
import SegmentGrid from "@/components/sections/SegmentGrid";
import Process from "@/components/sections/Process";
import FaqAccordion from "@/components/sections/FaqAccordion";
import RegionsTeaser from "@/components/sections/RegionsTeaser";
import CtaBox from "@/components/sections/CtaBox";
import LeadForm from "@/components/forms/LeadForm";
import { IMAGES } from "@/data/site";
import { regionPath } from "@/data/regions";
import { t } from "@/data/content";
import { JsonLd, faqLd, serviceLd } from "@/lib/seo";

export default function RegionView({ region: r }) {
  const locale = "nl";
  const c = t(locale);
  const title = `Vastgoed verkopen in ${r.name}`;
  return (
    <>
      <PageHero
        locale={locale}
        image={IMAGES[r.image]}
        imageAlt=""
        title={title}
        text={r.intro}
        trail={[
          { key: "regions", label: c.nav.regions },
          { path: regionPath(r.slug), label: r.name },
        ]}
      />
      <section className="py-20 md:py-28">
        <div className="wrap grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="h-section">Wat wij kopen in {r.name}</h2>
            <ul className="mt-8 space-y-5">
              {r.focus.map((f) => (
                <li key={f} className="flex items-start gap-4 text-[1.15rem] font-medium">
                  <CheckCircle size={30} weight="fill" className="shrink-0 text-band" />
                  {f}
                </li>
              ))}
            </ul>
            <h2 className="h-section mt-16">De vastgoedmarkt in {r.name}</h2>
            {r.market.map((m) => (
              <p key={m.slice(0, 30)} className="mt-5 max-w-[60ch] text-[1.08rem] text-muted">{m}</p>
            ))}
          </div>
          <div className="lg:sticky lg:top-28">
            <LeadForm locale={locale} source={`region-${r.slug}`} />
          </div>
        </div>
      </section>
      <div className="bg-soft">
        <SegmentGrid locale={locale} />
      </div>
      <Process locale={locale} />
      <FaqAccordion locale={locale} items={r.faq} title={`Vragen over verkopen in ${r.name}`} />
      <RegionsTeaser locale={locale} exclude={r.slug} />
      <CtaBox locale={locale} />
      <JsonLd data={serviceLd({ name: title, description: r.intro, path: regionPath(r.slug), area: r.name, serviceType: "Aankoop van vastgoed" })} />
      <JsonLd data={faqLd(r.faq)} />
    </>
  );
}
