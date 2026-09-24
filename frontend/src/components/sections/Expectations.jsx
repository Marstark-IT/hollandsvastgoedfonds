import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { x } from "@/data/extra";

export default function Expectations({ locale }) {
  const e = x(locale).expectations;
  return (
    <section className="py-20 md:py-28">
      <div className="wrap">
        <h2 className="h-section">{e.title}</h2>
        <ul className="mt-10 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {e.items.map((it) => (
            <li key={it} className="flex items-start gap-4 text-[1.1rem] font-medium">
              <CheckCircle size={28} weight="fill" className="shrink-0 text-band" />
              {it}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
