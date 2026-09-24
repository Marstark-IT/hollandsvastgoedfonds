import { MapPin, TrendUp, Coins, Lightbulb } from "@phosphor-icons/react/dist/ssr";
import { t } from "@/data/content";

const ICONS = [MapPin, TrendUp, Coins, Lightbulb];

export default function Criteria({ locale }) {
  const c = t(locale).pages.criteria;
  return (
    <section className="bg-soft py-20 md:py-28">
      <div className="wrap">
        <h2 className="h-section">{c.title}</h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.items.map((it, i) => {
            const Icon = ICONS[i];
            return (
              <li key={it.title} className="rounded bg-white p-7">
                <Icon size={38} weight="light" className="text-band" />
                <h3 className="mt-5 text-[1.3rem]">{it.title}</h3>
                <p className="mt-2 text-muted">{it.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
