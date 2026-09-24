import PageHero from "@/components/sections/PageHero";
import { FaqList } from "@/components/sections/FaqAccordion";
import CtaBox from "@/components/sections/CtaBox";
import { IMAGES } from "@/data/site";
import { t } from "@/data/content";
import { x } from "@/data/extra";
import { JsonLd, faqLd } from "@/lib/seo";

const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Questions grouped by topic, with jump links at the top.
export default function FaqView({ locale }) {
  const c = t(locale);
  const groups = x(locale).faqGroups;
  return (
    <>
      <PageHero
        locale={locale}
        image={IMAGES.residential}
        imageAlt={c.segments.items.residential.imageAlt}
        title={c.meta.faq.title}
        trail={[{ key: "faq", label: c.meta.faq.title }]}
      />
      <section className="py-16 md:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-16">
          <nav aria-label={c.meta.faq.title} className="lg:sticky lg:top-28 lg:self-start">
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {groups.map((g) => (
                <li key={g.title}>
                  <a href={`#${slug(g.title)}`} className="block rounded border border-line px-4 py-2.5 font-semibold text-brand hover:border-band hover:bg-soft lg:border-0 lg:px-3">
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-14">
            {groups.map((g) => (
              <div key={g.title} id={slug(g.title)}>
                <h2 className="text-[1.6rem] md:text-[1.9rem]">{g.title}</h2>
                <FaqList items={g.items} className="mt-5" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBox locale={locale} />
      <JsonLd data={faqLd(groups.flatMap((g) => g.items))} />
    </>
  );
}
