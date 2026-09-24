import PageHero from "@/components/sections/PageHero";
import LegalBody from "@/components/sections/LegalBody";
import { t } from "@/data/content";

export default function LegalView({ locale, page }) {
  const c = t(locale);
  return (
    <>
      <PageHero locale={locale} title={c.meta[page].title} trail={[{ key: page, label: c.meta[page].title }]} />
      <LegalBody locale={locale} blocks={c.legal[page]} />
    </>
  );
}
