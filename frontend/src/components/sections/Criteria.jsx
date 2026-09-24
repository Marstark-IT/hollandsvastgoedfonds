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
              <li key={it.title} className="card-fx overflow-hidden rounded bg-white p-7 hyphens-auto">
                <Icon aria-hidden="true" size={150} weight="thin" className="fx-mark" />
                <span className="fx-icon relative">
                  <Icon size={34} weight="light" />
                </span>
                <h3 className="relative mt-5 text-[1.3rem]">{it.title}</h3>
                <p className="relative mt-2 text-muted">{it.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
