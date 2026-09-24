import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { t } from "@/data/content";

// Persistent chrome around every page. Server component: no client JS beyond
// the mobile menu, language switch and lead forms.
export default function Shell({ locale, children }) {
  return (
    <>
      <a
        href="#inhoud"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-4 focus:py-2"
      >
        {t(locale).nav.skip}
      </a>
      <TopBar locale={locale} />
      <Header locale={locale} />
      <main id="inhoud">{children}</main>
      <Footer locale={locale} />
    </>
  );
}
