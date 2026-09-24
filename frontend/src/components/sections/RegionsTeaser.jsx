import Link from "next/link";
import { MapPin } from "@phosphor-icons/react/dist/ssr";
import { REGIONS, regionPath } from "@/data/regions";
import { x } from "@/data/extra";
import { href } from "@/data/site";

export default function RegionsTeaser({ locale, exclude }) {
  const r = x(locale).regionsTeaser;
  const list = REGIONS.filter((g) => g.slug !== exclude);
  return (
    <section className="py-20 md:py-28">
      <div className="wrap">
        <h2 className="h-section">{r.title}</h2>
        <p className="mt-5 max-w-[60ch] text-[1.1rem] text-muted">{r.text}</p>
        <ul className="mt-10 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
          {list.map((g) => (
            <li key={g.slug}>
              <Link
                href={regionPath(g.slug)}
                className="card-fx group flex items-center gap-3 rounded border border-line bg-white px-5 py-4 font-semibold text-brand"
              >
                <MapPin size={24} weight="fill" className="shrink-0 text-accent transition-transform duration-300 group-hover:-translate-y-0.5" />
                {g.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={href("regions", locale)} className="btn-outline mt-8">
          {r.all}
        </Link>
      </div>
    </section>
  );
}
