import Image from "next/image";
import PageHero from "@/components/sections/PageHero";
import Values from "@/components/sections/Values";
import Audiences from "@/components/sections/Audiences";
import Expectations from "@/components/sections/Expectations";
import FormSection from "@/components/sections/FormSection";
import { IMAGES } from "@/data/site";
import { t } from "@/data/content";

export default function AboutView({ locale }) {
  const c = t(locale);
  const p = c.pages.about;
  return (
    <>
      <PageHero
        locale={locale}
        image={IMAGES.hero}
        imageAlt={c.hero.imageAlt}
        title={p.title}
        text={p.text}
        trail={[{ key: "about", label: c.nav.about }]}
      />
      <section className="py-20 md:py-28">
        <div className="wrap grid gap-12 md:grid-cols-3">
          {p.blocks.map((b) => (
            <div key={b.title} className="card-fx rounded border border-line border-t-4 border-t-accent bg-white p-8">
              <h2 className="text-[1.5rem]">{b.title}</h2>
              <p className="mt-4 text-[1.08rem] text-muted">{b.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-soft py-20 md:py-28">
        <div className="wrap max-w-[860px]">
          <h2 className="h-section">{p.storyTitle}</h2>
          {p.story.map((para) => (
            <p key={para.slice(0, 32)} className="mt-6 text-[1.1rem] leading-relaxed text-ink/85">{para}</p>
          ))}
        </div>
      </section>
      <Values locale={locale} />
      <Audiences locale={locale} />
      <section className="relative overflow-hidden">
        <div className="relative h-[340px] md:h-[440px]">
          <Image src={IMAGES.heroWide} alt={c.hero.imageAlt} fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-brand-dark/60" />
          <p className="wrap absolute inset-0 flex max-w-[980px] items-center justify-center text-center text-[1.7rem] font-bold leading-snug text-white md:text-[2.4rem]">
            {p.closing}
          </p>
        </div>
      </section>
      <Expectations locale={locale} />
      <FormSection locale={locale} source="about-form" />
    </>
  );
}
