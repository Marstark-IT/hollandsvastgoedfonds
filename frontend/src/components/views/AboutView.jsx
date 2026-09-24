import PageHero from "@/components/sections/PageHero";
import UspBand from "@/components/sections/UspBand";
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
            <div key={b.title} className="border-t-4 border-accent pt-7">
              <h2 className="text-[1.5rem]">{b.title}</h2>
              <p className="mt-4 text-[1.08rem] text-muted">{b.text}</p>
            </div>
          ))}
        </div>
      </section>
      <UspBand locale={locale} />
      <section className="py-20 md:py-28">
        <p className="wrap max-w-[900px] text-center text-[1.8rem] font-bold leading-snug text-brand md:text-[2.3rem]">
          {p.closing}
        </p>
      </section>
      <FormSection locale={locale} source="about-form" />
    </>
  );
}
