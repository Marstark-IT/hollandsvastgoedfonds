import { CheckCircle, MinusCircle } from "@phosphor-icons/react/dist/ssr";
import { x } from "@/data/extra";

// Direct sale vs. agent. A real table on wide screens, stacked cards on phones.
export default function Compare({ locale }) {
  const c = x(locale).compare;
  return (
    <section className="bg-soft py-20 md:py-28">
      <div className="wrap max-w-[1000px]">
        <h2 className="h-section">{c.title}</h2>

        <div className="mt-10 hidden overflow-hidden rounded bg-white md:block">
          <table className="w-full text-left">
            <caption className="sr-only">{c.title}</caption>
            <thead>
              <tr className="bg-brand text-white">
                <th scope="col" className="w-1/3 px-6 py-4 font-semibold"><span className="sr-only">-</span></th>
                <th scope="col" className="px-6 py-4 text-[1.05rem] font-bold">{c.colUs}</th>
                <th scope="col" className="px-6 py-4 text-[1.05rem] font-semibold text-white/85">{c.colAgent}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {c.rows.map(([label, us, agent]) => (
                <tr key={label}>
                  <th scope="row" className="px-6 py-5 font-semibold text-ink">{label}</th>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-start gap-2 font-medium text-ink">
                      <CheckCircle size={24} weight="fill" className="shrink-0 text-band" />
                      {us}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-start gap-2 text-muted">
                      <MinusCircle size={24} className="shrink-0 text-muted/70" />
                      {agent}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="mt-8 space-y-4 md:hidden">
          {c.rows.map(([label, us, agent]) => (
            <li key={label} className="rounded bg-white p-5">
              <p className="font-bold text-brand">{label}</p>
              <p className="mt-3 flex items-start gap-2 font-medium">
                <CheckCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-band" />
                <span><span className="sr-only">{c.colUs}: </span>{us}</span>
              </p>
              <p className="mt-2 flex items-start gap-2 text-muted">
                <MinusCircle size={22} className="mt-0.5 shrink-0" />
                <span><span className="font-semibold">{c.colAgent}:</span> {agent}</span>
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-[0.95rem] text-muted">{c.note}</p>
      </div>
    </section>
  );
}
