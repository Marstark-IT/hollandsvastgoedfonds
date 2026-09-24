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
          className="object-cover object-[78%_center] lg:object-center"
        />
        {/* Soft white wash keeps the headline at AAA contrast on every screen. */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-white/80 via-white/35 to-transparent lg:block" />
      </div>

      <div className="wrap relative grid items-center gap-6 pb-14 lg:min-h-[660px] lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-20">
        <div className="-mt-16 rounded bg-white p-7 shadow-card sm:p-9 lg:mt-0 lg:bg-transparent lg:p-0 lg:shadow-none">
          <h1 className="text-[2.1rem] leading-[1.12] sm:text-[2.6rem] lg:text-[3.2rem]">{c.hero.title}</h1>
          <p className="mt-6 max-w-[34ch] text-[1.2rem] font-medium text-ink/80">{c.hero.text}</p>
        </div>
        <div id="aanbieden">
          <LeadForm locale={locale} source="hero" />
        </div>
      </div>
    </section>
  );
}
