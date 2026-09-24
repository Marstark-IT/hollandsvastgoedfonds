import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import RegionSplit from "@/components/sections/RegionSplit";
import FormSection from "@/components/sections/FormSection";
import { REGIONS, REGIONS_INTRO, regionPath } from "@/data/regions";
import { IMAGES } from "@/data/site";
import { t } from "@/data/content";

export default function RegionsView({ locale = "nl" }) {
  const c = t(locale);
  return (
    <>
      <PageHero
        locale={locale}
        image={IMAGES.region}
        imageAlt={c.region.imageAlt}
        title={c.meta.regions.title}
        text={c.meta.regions.description}
        trail={[{ key: "regions", label: c.nav.regions }]}
      />
      <section className="pt-16 md:pt-24">
        <div className="wrap max-w-[860px]">
          {REGIONS_INTRO.map((para) => (
            <p key={para.slice(0, 32)} className="mt-5 text-[1.1rem] leading-relaxed text-ink/85 first:mt-0">{para}</p>
          ))}
        </div>
      </section>
      <section className="py-16 md:py-24">
        <ul className="wrap grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REGIONS.map((r) => (
            <li key={r.slug}>
              <Link href={regionPath(r.slug)} className="card-fx group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded">
                <Image src={IMAGES[r.image]} alt="" fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="fx-zoom object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent" />
                <div className="relative p-6 text-white">
                  <p className="text-[0.85rem] font-semibold text-white/80">{r.province}</p>
                  <h2 className="text-[1.4rem] text-white">{r.name}</h2>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="wrap mt-14 grid gap-x-12 gap-y-6 md:grid-cols-2">
          {REGIONS.map((r) => (
            <div key={r.slug}>
              <h3 className="text-[1.2rem]"><Link href={regionPath(r.slug)} className="hover:text-accent hover:underline">Vastgoed verkopen in {r.name}</Link></h3>
              <p className="mt-2 text-muted">{r.intro}</p>
            </div>
          ))}
        </div>
      </section>
      <RegionSplit locale={locale} />
      <FormSection locale={locale} source="regions" />
    </>
  );
}
