import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { IMAGES, href } from "@/data/site";
import { t } from "@/data/content";

export default function DirectSplit({ locale }) {
  const c = t(locale);
  return (
    <section className="py-20 md:py-28">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="h-section">{c.direct.title}</h2>
          <p className="mt-6 max-w-[52ch] text-[1.1rem] text-muted">{c.direct.text}</p>
          <Link href={href("approach", locale)} className="mt-8 inline-flex items-center gap-2 font-bold text-accent hover:underline">
            {c.region.link}
            <ArrowRight size={20} weight="bold" />
          </Link>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded">
          <Image src={IMAGES.residential} alt={c.segments.items.residential.imageAlt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
