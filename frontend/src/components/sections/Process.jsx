import { t } from "@/data/content";

// Coloured band with white cards that overlap its lower edge.
export default function Process({ locale }) {
  const c = t(locale).process;
  return (
    <section className="relative pb-20 md:pb-28">
      <div className="absolute inset-x-0 top-0 h-[62%] bg-band md:h-[70%]" aria-hidden="true" />
      <div className="wrap relative pt-20 md:pt-24">
        <h2 className="h-section text-center text-white">{c.title}</h2>
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((s, i) => (
            <li key={s.title} className="rounded bg-white p-7 text-center shadow-card">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-[1.2rem] font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 text-[1.3rem]">{s.title}</h3>
              <p className="mt-3 text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
