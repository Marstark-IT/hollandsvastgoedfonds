import Image from "next/image";
import Link from "next/link";
import { IMAGES, href } from "@/data/site";
import { t } from "@/data/content";

export default function RegionSplit({ locale }) {
  const c = t(locale);
  return (
    <section className="pb-20 md:pb-28">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div className="relative aspect-[16/10] overflow-hidden rounded">
          <Image src={IMAGES.region} alt={c.region.imageAlt} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
        </div>
        <div>
          <h2 className="h-section">{c.region.title}</h2>
          <p className="mt-6 max-w-[48ch] text-[1.1rem] text-muted">{c.region.text}</p>
          <Link href={href("approach", locale)} className="btn-outline mt-8">
            {c.region.link}
          </Link>
        </div>
      </div>
    </section>
  );
}
