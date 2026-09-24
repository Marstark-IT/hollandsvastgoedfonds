import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import LeadForm from "@/components/forms/LeadForm";
import { COMPANY } from "@/data/site";
import { t } from "@/data/content";

// Grey band: reasons on the left, the lead form on the right.
export default function FormSection({ locale, id, source = "form-section" }) {
  const c = t(locale);
  return (
    <section id={id} className="bg-soft py-20 md:py-28">
      <div className="wrap grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="lg:pt-6">
          <h2 className="h-section">{c.why.title}</h2>
          <ul className="mt-8 space-y-5">
            {c.direct.points.map((p) => (
              <li key={p} className="flex items-start gap-4 text-[1.15rem] font-medium">
                <CheckCircle size={30} weight="fill" className="shrink-0 text-band" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-muted">
            {c.why.mail}{" "}
            <a href={COMPANY.emailHref} className="font-semibold text-brand underline">
              {COMPANY.email}
            </a>
          </p>
        </div>
        <LeadForm locale={locale} source={source} />
      </div>
    </section>
  );
}
