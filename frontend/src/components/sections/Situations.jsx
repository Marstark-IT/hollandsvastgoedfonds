import Link from "next/link";
import { House, Buildings, Scroll, Key, Warehouse, Wrench, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { articlePath } from "@/data/articles";
import { x } from "@/data/extra";

const ICONS = { house: House, buildings: Buildings, scroll: Scroll, key: Key, warehouse: Warehouse, wrench: Wrench };

// Common seller situations, each linking to the matching knowledge-base article.
// Hover / keyboard focus: an accent border draws itself around the card (four
// edges, staggered), the icon tile fills with the brand colour, a large faint
// watermark of the icon slides in and the link turns into a pill button. The
// card itself stays white so it reads differently from the process cards.
export default function Situations({ locale, tone = "white" }) {
  const s = x(locale).situations;
  const edge = "pointer-events-none absolute bg-accent transition-transform duration-300 ease-out motion-reduce:transition-none";
  return (
    <section className={`${tone === "soft" ? "bg-soft" : ""} py-20 md:py-28`}>
      <div className="wrap">
        <h2 className="h-section">{s.title}</h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {s.items.map((it) => {
            const Icon = ICONS[it.icon];
            return (
              <li key={it.title}>
                <Link
                  href={articlePath(it.article)}
                  className="group relative flex h-full flex-col overflow-hidden rounded border border-line bg-white p-7 outline-none transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(15,59,95,0.45)] focus-visible:-translate-y-1 motion-reduce:hover:translate-y-0"
                >
                  {/* Border trace: top -> right -> bottom -> left */}
                  <span aria-hidden="true" className={`${edge} left-0 top-0 h-[3px] w-full origin-left scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100`} />
                  <span aria-hidden="true" className={`${edge} right-0 top-0 h-full w-[3px] origin-top scale-y-0 delay-0 group-hover:scale-y-100 group-hover:delay-150 group-focus-visible:scale-y-100`} />
                  <span aria-hidden="true" className={`${edge} bottom-0 right-0 h-[3px] w-full origin-right scale-x-0 group-hover:scale-x-100 group-hover:delay-300 group-focus-visible:scale-x-100`} />
                  <span aria-hidden="true" className={`${edge} bottom-0 left-0 h-full w-[3px] origin-bottom scale-y-0 group-hover:scale-y-100 group-hover:delay-[450ms] group-focus-visible:scale-y-100`} />

                  {/* Watermark icon */}
                  <Icon
                    aria-hidden="true"
                    size={170}
                    weight="thin"
                    className="pointer-events-none absolute -bottom-10 -right-8 text-band opacity-0 transition-all duration-500 ease-out translate-x-6 translate-y-6 rotate-12 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rotate-0 group-hover:opacity-[0.07] group-focus-visible:opacity-[0.07] motion-reduce:transition-none"
                  />

                  <span className="relative flex h-16 w-16 items-center justify-center rounded bg-band/10 text-band transition-colors duration-300 group-hover:bg-band group-hover:text-white group-focus-visible:bg-band group-focus-visible:text-white">
                    <Icon size={34} weight="light" className="transition-transform duration-300 group-hover:scale-110" />
                  </span>
                  <h3 className="relative mt-6 text-[1.3rem]">{it.title}</h3>
                  <p className="relative mt-2 flex-1 text-muted">{it.text}</p>
                  <span className="relative mt-6 inline-flex items-center gap-2 self-start rounded px-0 py-2 font-bold text-accent transition-all duration-300 group-hover:bg-accent group-hover:px-4 group-hover:text-white group-focus-visible:bg-accent group-focus-visible:px-4 group-focus-visible:text-white">
                    {s.more}
                    <ArrowRight size={18} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
