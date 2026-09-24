import { Handshake, Bank, LockKey, UserCircle } from "@phosphor-icons/react/dist/ssr";
import { t } from "@/data/content";

const ICONS = [Handshake, Bank, LockKey, UserCircle];

export default function UspBand({ locale }) {
  const facts = t(locale).facts;
  return (
    <section className="bg-band text-white">
      <ul className="wrap grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((f, i) => {
          const Icon = ICONS[i];
          return (
            <li key={f.title} className="flex gap-4">
              <Icon size={40} weight="light" className="shrink-0" />
              <div>
                <h2 className="text-[1.15rem] font-bold text-white">{f.title}</h2>
                <p className="mt-1 text-[0.95rem] leading-snug text-white/90">{f.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
