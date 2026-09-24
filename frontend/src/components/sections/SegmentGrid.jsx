import Image from "next/image";
import Link from "next/link";
import { IMAGES, href } from "@/data/site";
import { t } from "@/data/content";

const KEYS = ["residential", "commercial", "industrial", "special"];

// Photo cards with a solid brand tint and a clear button, as on the reference.
export default function SegmentGrid({ locale, keys = KEYS, heading = true, as: H = "h2" }) {
  const c = t(locale);
  return (
    <section className="py-20 md:py-28">
      <div className="wrap">
        {heading && <h2 className="h-section">{c.segments.title}</h2>}
        <div className={`grid gap-5 sm:grid-cols-2 ${keys.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} ${heading ? "mt-10" : ""}`}>
          {keys.map((k) => {
            const s = c.segments.items[k];
            return (
              <Link
                key={k}
                href={href(k, locale)}
                className="card-fx group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded"
              >
                <Image
                  src={IMAGES[k]}
                  alt={s.imageAlt}
                  fill
                  sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                  className="fx-zoom object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/55 to-brand-dark/10" />
                <div className="relative p-7 text-white hyphens-auto lg:p-6 xl:p-7">
                  <H className="text-[1.45rem] font-bold text-white lg:text-[1.3rem] xl:text-[1.4rem]">{s.title}</H>
                  <p className="mt-2 text-white/90">{s.short}</p>
                  <span className="btn mt-5 px-5 py-2.5 text-[0.95rem]">{c.more}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
