import { Check } from "@phosphor-icons/react/dist/ssr";
import { t } from "@/data/content";

// Coloured band with white cards overlapping its lower edge. On hover or keyboard
// focus a card lifts, flips to the brand colour and expands its detail list
// (CSS grid-rows 0fr -> 1fr). Touch screens have no hover, so below md the
// details are always open.
export default function Process({ locale }) {
  const c = t(locale).process;
  return (
    <section className="relative pb-20 md:pb-28">
      <div className="absolute inset-x-0 top-0 h-[45%] bg-band md:h-[60%]" aria-hidden="true" />
      <div className="wrap relative pt-20 md:pt-24">
        <h2 className="h-section text-center text-white">{c.title}</h2>
        <ol className="mt-12 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((s, i) => (
            <li
              key={s.title}
              tabIndex={0}
              className="group relative overflow-hidden rounded bg-white p-7 text-center shadow-card outline-none transition-all duration-300 ease-out hover:-translate-y-2 hover:bg-brand hover:shadow-[0_24px_48px_-16px_rgba(15,59,95,0.55)] focus-visible:-translate-y-2 focus-visible:bg-brand focus-visible:ring-4 focus-visible:ring-accent/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100" aria-hidden="true" />
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-[1.25rem] font-bold text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-accent group-focus-visible:bg-white group-focus-visible:text-accent">
                {i + 1}
              </span>
              <h3 className="mt-5 text-[1.3rem] transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
                {s.title}
              </h3>
              <p className="mt-3 text-muted transition-colors duration-300 group-hover:text-white/90 group-focus-visible:text-white/90">
                {s.text}
              </p>

              {s.more && (
                <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-visible:grid-rows-[1fr]">
                  <ul className="overflow-hidden text-left">
                    <li aria-hidden="true" className="mx-auto mt-5 h-px w-12 bg-line group-hover:bg-white/30" />
                    {s.more.map((m) => (
                      <li key={m} className="mt-3 flex items-start gap-2.5 text-[0.95rem] text-ink transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
                        <Check size={18} weight="bold" className="mt-0.5 shrink-0 text-accent group-hover:text-accent" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
