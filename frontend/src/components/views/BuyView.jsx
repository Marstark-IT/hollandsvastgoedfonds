import PageHero from "@/components/sections/PageHero";
import SegmentGrid from "@/components/sections/SegmentGrid";
import Criteria from "@/components/sections/Criteria";
import FormSection from "@/components/sections/FormSection";
import { IMAGES } from "@/data/site";
import { t } from "@/data/content";

export default function BuyView({ locale }) {
  const c = t(locale);
  return (
    <>
      <PageHero
        locale={locale}
        image={IMAGES.street}
        imageAlt={c.direct.imageAlt}
        title={c.pages.buy.title}
        text={c.pages.buy.text}
        trail={[{ key: "buy", label: c.nav.buy }]}
      />
      <SegmentGrid locale={locale} heading={false} />
      <Criteria locale={locale} />
      <FormSection locale={locale} source="buy-form" />
    </>
  );
}
