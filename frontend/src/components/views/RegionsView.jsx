import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import RegionSplit from "@/components/sections/RegionSplit";
import FormSection from "@/components/sections/FormSection";
import { REGIONS, regionPath } from "@/data/regions";
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
      <section className="py-16 md:py-24">
        <ul className="wrap grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REGIONS.map((r) => (
            <li key={r.slug}>
              <Link href={regionPath(r.slug)} className="group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded">
                <Image src={IMAGES[r.image]} alt="" fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent" />
                <div className="relative p-6 text-white">
                  <p className="text-[0.85rem] font-semibold text-white/80">{r.province}</p>
                  <h2 className="text-[1.4rem] text-white">{r.name}</h2>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <RegionSplit locale={locale} />
      <FormSection locale={locale} source="regions" />
    </>
  );
}
