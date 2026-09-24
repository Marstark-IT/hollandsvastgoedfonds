import Image from "next/image";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import PageHero from "@/components/sections/PageHero";
import Criteria from "@/components/sections/Criteria";
import SegmentGrid from "@/components/sections/SegmentGrid";
import CtaBox from "@/components/sections/CtaBox";
import LeadForm from "@/components/forms/LeadForm";
import { IMAGES } from "@/data/site";
import { t } from "@/data/content";

const ALL = ["residential", "commercial", "industrial", "special"];

// Shared template for the four "what we buy" detail pages.
export default function SegmentView({ locale, segment }) {
  const c = t(locale);
  const page = c.pages[segment];
  const seg = c.segments.items[segment];
  return (
    <>
      <PageHero
        locale={locale}
        image={IMAGES[segment]}
        imageAlt={seg.imageAlt}
        title={page.title}
        text={page.text}
        trail={[
          { key: "buy", label: c.nav.buy },
          { key: segment, label: seg.title },
        ]}
      />

      <section className="py-20 md:py-28">
        <div className="wrap grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="h-section">{c.pages.segment.lookFor}</h2>
            <ul className="mt-8 space-y-5">
              {page.list.map((p) => (
                <li key={p} className="flex items-start gap-4 text-[1.15rem] font-medium">
                  <CheckCircle size={30} weight="fill" className="shrink-0 text-band" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded lg:block">
              <Image src={IMAGES[segment]} alt={seg.imageAlt} fill sizes="50vw" className="object-cover" />
            </div>
          </div>
          <div className="lg:sticky lg:top-28">
            <LeadForm locale={locale} source={`segment-${segment}`} />
          </div>
        </div>
      </section>

      <Criteria locale={locale} />

      <section className="pt-20 md:pt-28">
        <div className="wrap">
          <h2 className="h-section">{c.pages.segment.others}</h2>
        </div>
      </section>
      <div className="-mt-10 md:-mt-14">
        <SegmentGrid locale={locale} keys={ALL.filter((k) => k !== segment)} heading={false} as="h3" />
      </div>
      <CtaBox locale={locale} />
    </>
  );
}
