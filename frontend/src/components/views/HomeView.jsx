import Hero from "@/components/sections/Hero";
import UspBand from "@/components/sections/UspBand";
import DirectSplit from "@/components/sections/DirectSplit";
import SegmentGrid from "@/components/sections/SegmentGrid";
import Situations from "@/components/sections/Situations";
import Process from "@/components/sections/Process";
import Compare from "@/components/sections/Compare";
import RegionSplit from "@/components/sections/RegionSplit";
import FormSection from "@/components/sections/FormSection";
import ArticleTeaser from "@/components/sections/ArticleTeaser";
import RegionsTeaser from "@/components/sections/RegionsTeaser";
import FaqAccordion from "@/components/sections/FaqAccordion";
import CtaBox from "@/components/sections/CtaBox";
import { JsonLd, faqLd } from "@/lib/seo";
import { t } from "@/data/content";

export default function HomeView({ locale }) {
  const faq = t(locale).faq.slice(0, 6);
  return (
    <>
      <Hero locale={locale} />
      <UspBand locale={locale} />
      <DirectSplit locale={locale} />
      <SegmentGrid locale={locale} />
      <Situations locale={locale} tone="soft" />
      <Process locale={locale} />
      <Compare locale={locale} />
      <RegionSplit locale={locale} />
      <FormSection locale={locale} source="home-form" />
      <ArticleTeaser locale={locale} />
      {locale === "nl" && <RegionsTeaser locale={locale} />}
      <FaqAccordion locale={locale} items={faq} limit={6} tone="soft" />
      <div className="pt-20 md:pt-28" />
      <CtaBox locale={locale} />
      <JsonLd data={faqLd(faq)} />
    </>
  );
}
