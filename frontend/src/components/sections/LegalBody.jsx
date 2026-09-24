import { t } from "@/data/content";

export default function LegalBody({ locale, blocks }) {
  return (
    <section className="py-16 md:py-24">
      <div className="wrap max-w-[820px] prose-legal">
        <p className="text-[0.95rem] text-muted">{t(locale).legal.updated}</p>
        {blocks.map((b) => (
          <div key={b.h}>
            <h2>{b.h}</h2>
            <p>{b.p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
