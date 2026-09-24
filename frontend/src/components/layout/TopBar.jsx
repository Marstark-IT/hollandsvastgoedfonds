import { EnvelopeSimple, Check } from "@phosphor-icons/react/dist/ssr";
import { COMPANY } from "@/data/site";
import { t } from "@/data/content";

export default function TopBar({ locale }) {
  const c = t(locale);
  return (
    <div className="hidden border-b border-line bg-white text-[0.85rem] text-muted md:block">
      <div className="wrap flex h-11 items-center justify-between">
        <a href={COMPANY.emailHref} className="inline-flex items-center gap-2 hover:text-brand">
          <EnvelopeSimple size={18} weight="bold" className="text-band" />
          {COMPANY.email}
        </a>
        <ul className="flex items-center gap-6">
          {c.topbar.map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5">
              <Check size={16} weight="bold" className="text-band" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
