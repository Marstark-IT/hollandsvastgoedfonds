import { User, ChartLineUp, UsersThree, Briefcase, Bank } from "@phosphor-icons/react/dist/ssr";
import { x } from "@/data/extra";

const ICONS = [User, ChartLineUp, UsersThree, Briefcase, Bank];

export default function Audiences({ locale }) {
  const a = x(locale).audiences;
  return (
    <section className="py-20 md:py-28">
      <div className="wrap">
        <h2 className="h-section">{a.title}</h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {a.items.map((it, i) => {
            const Icon = ICONS[i];
            return (
              <li key={it.title} className="rounded bg-soft p-6">
                <Icon size={36} weight="light" className="text-band" />
                <h3 className="mt-4 text-[1.15rem]">{it.title}</h3>
                <p className="mt-2 text-[0.98rem] text-muted">{it.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
