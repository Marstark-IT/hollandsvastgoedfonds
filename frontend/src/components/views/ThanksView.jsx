import Link from "next/link";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import NextSteps from "@/components/sections/NextSteps";
import ArticleTeaser from "@/components/sections/ArticleTeaser";
import ConversionEvent from "@/components/analytics/ConversionEvent";
import { COMPANY, href } from "@/data/site";
import { t } from "@/data/content";

export default function ThanksView({ locale }) {
  const p = t(locale).pages.thanks;
  return (
    <>
      <ConversionEvent />
      <section className="py-24 md:py-32">
        <div className="wrap max-w-[760px] text-center">
          <CheckCircle size={72} weight="fill" className="mx-auto text-band" />
          <h1 className="mt-6 text-[2rem] md:text-[2.5rem]">{p.title}</h1>
          <p className="mx-auto mt-6 max-w-[52ch] text-[1.15rem] text-muted">
            {p.text}{" "}
            <a href={COMPANY.emailHref} className="break-all font-semibold text-brand underline">{COMPANY.email}</a>.
          </p>
          <Link href={href("home", locale)} className="btn mt-10">{p.back}</Link>
        </div>
      </section>
      <NextSteps locale={locale} />
      <ArticleTeaser locale={locale} />
    </>
  );
}
