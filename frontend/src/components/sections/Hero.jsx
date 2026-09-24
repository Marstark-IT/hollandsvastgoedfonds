import Image from "next/image";
import LeadForm from "@/components/forms/LeadForm";
import { IMAGES } from "@/data/site";
import { t } from "@/data/content";

// Desktop: full-width canal photo, headline set directly on the pale sky on the
// left, solid white lead form on the right. Mobile: photo band, then a white
// headline card and the form stacked on a light background.
export default function Hero({ locale }) {
  const c = t(locale);
  return (
    <section className="relative bg-soft lg:bg-transparent">
      <div className="relative h-60 sm:h-80 lg:absolute lg:inset-0 lg:h-auto">
        <Image
          src={IMAGES.heroWide}
          alt={c.hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[18%_bottom] lg:object-bottom"
        />
        {/* Light wash over the sky only (top-left), so the headline stays crisp
            while the waterfront buildings below remain fully visible. */}
        <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.75),rgba(255,255,255,0.25)_45%,transparent_70%)] lg:block" />
      </div>

      <div className="wrap relative grid items-center gap-6 pb-14 lg:min-h-[max(720px,calc(420px+25vw))] lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-16 lg:pb-20 lg:pt-16">
        <div className="-mt-16 rounded bg-white p-7 shadow-card sm:p-9 lg:mt-6 lg:bg-transparent lg:p-0 lg:shadow-none">
          <h1 className="rise text-[2.1rem] leading-[1.12] sm:text-[2.6rem] lg:text-[3.2rem]">{c.hero.title}</h1>
          <p className="rise rise-2 mt-6 max-w-[34ch] text-[1.2rem] font-medium text-ink/80">{c.hero.text}</p>
        </div>
        <div id="aanbieden" className="rise rise-3">
          <LeadForm locale={locale} source="hero" />
        </div>
      </div>
    </section>
  );
}
