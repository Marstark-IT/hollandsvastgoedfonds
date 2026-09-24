import { x } from "@/data/extra";

export default function NextSteps({ locale }) {
  const n = x(locale).nextSteps;
  return (
    <section className="bg-soft py-20 md:py-24">
      <div className="wrap">
        <h2 className="h-section">{n.title}</h2>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {n.items.map((s, i) => (
            <li key={s.title} className="relative rounded bg-white p-7">
              <span className="text-[2.4rem] font-black leading-none text-band/25">{i + 1}</span>
              <h3 className="mt-3 text-[1.25rem]">{s.title}</h3>
              <p className="mt-2 text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
