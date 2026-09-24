import Hero from "@/components/sections/Hero";
import UspBand from "@/components/sections/UspBand";
import DirectSplit from "@/components/sections/DirectSplit";
import SegmentGrid from "@/components/sections/SegmentGrid";
import RegionSplit from "@/components/sections/RegionSplit";
import Process from "@/components/sections/Process";
import FormSection from "@/components/sections/FormSection";
import FaqAccordion from "@/components/sections/FaqAccordion";
import CtaBox from "@/components/sections/CtaBox";
import { JsonLd, faqLd } from "@/lib/seo";

export default function HomeView({ locale }) {
  return (
    <>
      <Hero locale={locale} />
      <UspBand locale={locale} />
      <DirectSplit locale={locale} />
      <SegmentGrid locale={locale} />
      <RegionSplit locale={locale} />
      <Process locale={locale} />
      <FormSection locale={locale} source="home-form" />
      <FaqAccordion locale={locale} limit={5} />
      <CtaBox locale={locale} />
      <JsonLd data={faqLd(locale)} />
    </>
  );
}
