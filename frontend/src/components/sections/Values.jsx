import { x } from "@/data/extra";

// Values on the coloured band: large type, no icons.
export default function Values({ locale }) {
  const v = x(locale).values;
  return (
    <section className="bg-band py-20 text-white md:py-24">
      <div className="wrap">
        <h2 className="h-section text-white">{v.title}</h2>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {v.items.map((it) => (
            <li key={it.title} className="border-l-4 border-accent pl-5">
              <h3 className="text-[1.35rem] text-white">{it.title}</h3>
              <p className="mt-2 text-white/90">{it.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
