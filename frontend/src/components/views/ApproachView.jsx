import Image from "next/image";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import PageHero from "@/components/sections/PageHero";
import Process from "@/components/sections/Process";
import Expectations from "@/components/sections/Expectations";
import Values from "@/components/sections/Values";
import RegionsTeaser from "@/components/sections/RegionsTeaser";
import Compare from "@/components/sections/Compare";
import CtaBox from "@/components/sections/CtaBox";
import { IMAGES } from "@/data/site";
import { t } from "@/data/content";

export default function ApproachView({ locale }) {
  const c = t(locale);
  const p = c.pages.approach;
  return (
    <>
      <PageHero
        locale={locale}
        image={IMAGES.region}
        imageAlt={c.region.imageAlt}
        title={p.title}
        text={p.text}
        trail={[{ key: "approach", label: c.nav.approach }]}
      />

      <section className="py-20 md:py-28">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="h-section">{p.regionTitle}</h2>
            <p className="mt-6 max-w-[52ch] text-[1.1rem] text-muted">{p.regionText}</p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded">
            <Image src={IMAGES.commercial} alt={c.segments.items.commercial.imageAlt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-soft py-20 md:py-28">
        <div className="wrap">
          <h2 className="h-section">{p.deployTitle}</h2>
          <p className="mt-6 max-w-[60ch] text-[1.1rem] text-muted">{p.deployText}</p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {p.deployList.map((item) => (
              <li key={item} className="card-fx flex items-center gap-4 rounded bg-white p-6 text-[1.1rem] font-semibold">
                <span className="fx-icon h-12 w-12">
                  <CheckCircle size={26} weight="fill" />
                </span>
                <span className="min-w-0">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="wrap max-w-[860px] text-center">
          <h2 className="h-section">{p.inHouseTitle}</h2>
          <p className="mx-auto mt-6 max-w-[60ch] text-[1.15rem] text-muted">{p.inHouseText}</p>
        </div>
      </section>

      <Process locale={locale} />
      <Expectations locale={locale} />
      <Values locale={locale} />
      {locale === "nl" && <RegionsTeaser locale={locale} />}
      <Compare locale={locale} />
      <div className="pt-20 md:pt-28" />
      <CtaBox locale={locale} />
    </>
  );
}
