import { Check, ArrowsClockwise } from "@phosphor-icons/react/dist/ssr";
import { t } from "@/data/content";

// Coloured band with white cards overlapping its lower edge. Each card is a 3D
// flip card: front = number, title, short text; back = the detail list on the
// brand colour. Front and back share one grid cell, so every card is as tall as
// its largest face and all cards in a row match; nothing resizes on hover.
// Hover (pointer), keyboard focus or a tap (focus) flips it. Reduced motion:
// the back fades in instead of rotating.
export default function Process({ locale }) {
  const c = t(locale).process;
  const hint = locale === "nl" ? "Meer details" : "More details";
  return (
    <section className="relative pb-20 md:pb-28">
      <div className="absolute inset-x-0 top-0 h-[45%] bg-band md:h-[60%]" aria-hidden="true" />
      <div className="wrap relative pt-20 md:pt-24">
        <h2 className="h-section text-center text-white">{c.title}</h2>
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((s, i) => (
            <li key={s.title} className="flip-card" tabIndex={0} aria-label={`${i + 1}. ${s.title}`}>
              <div className="flip-inner">
                <div className="flip-face flip-front rounded bg-white p-7 text-center shadow-card">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-[1.25rem] font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-[1.3rem]">{s.title}</h3>
                  <p className="mt-3 text-muted">{s.text}</p>
                  <span className="mt-auto inline-flex items-center justify-center gap-1.5 pt-5 text-[0.9rem] font-semibold text-accent">
                    <ArrowsClockwise size={16} weight="bold" aria-hidden="true" />
                    {hint}
                  </span>
                </div>
                <div className="flip-face flip-back rounded bg-brand p-7 text-white shadow-card" aria-hidden="false">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[1.05rem] font-bold text-accent">
                      {i + 1}
                    </span>
                    <h3 className="text-[1.25rem] text-white">{s.title}</h3>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {s.more.map((m) => (
                      <li key={m} className="flex items-start gap-2.5 text-[0.98rem] leading-snug text-white">
                        <Check size={18} weight="bold" className="mt-0.5 shrink-0 text-accent-light" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
