import Image from "next/image";
import Link from "next/link";
import { IMAGES, href } from "@/data/site";
import { t } from "@/data/content";

// Photo on the left, coloured panel with the single CTA on the right.
export default function CtaBox({ locale }) {
  const c = t(locale);
  return (
    <section className="pb-20 md:pb-28">
      <div className="wrap">
        <div className="grid overflow-hidden rounded lg:grid-cols-2">
          <div className="relative min-h-[280px]">
            <Image src={IMAGES.street} alt={c.direct.imageAlt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="bg-band p-10 text-white md:p-14">
            <h2 className="h-section text-white">{c.finalCta.title}</h2>
            <p className="mt-5 max-w-[40ch] text-[1.1rem] text-white/90">{c.finalCta.text}</p>
            <Link href={`${href("home", locale)}#aanbieden`} className="btn mt-8">
              {c.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
