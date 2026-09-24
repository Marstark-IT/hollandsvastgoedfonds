import PageHero from "@/components/sections/PageHero";
import FaqAccordion from "@/components/sections/FaqAccordion";
import CtaBox from "@/components/sections/CtaBox";
import { IMAGES } from "@/data/site";
import { t } from "@/data/content";
import { JsonLd, faqLd } from "@/lib/seo";

export default function FaqView({ locale }) {
  const c = t(locale);
  return (
    <>
      <PageHero
        locale={locale}
        image={IMAGES.residential}
        imageAlt={c.segments.items.residential.imageAlt}
        title={c.meta.faq.title}
        trail={[{ key: "faq", label: c.meta.faq.title }]}
      />
      <FaqAccordion locale={locale} heading={false} />
      <CtaBox locale={locale} />
      <JsonLd data={faqLd(locale)} />
    </>
  );
}
