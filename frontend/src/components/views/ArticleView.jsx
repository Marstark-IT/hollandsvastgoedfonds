import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Clock } from "@phosphor-icons/react/dist/ssr";
import PageHero from "@/components/sections/PageHero";
import ArticleTeaser from "@/components/sections/ArticleTeaser";
import LeadForm from "@/components/forms/LeadForm";
import { IMAGES, href } from "@/data/site";
import { t } from "@/data/content";
import { articlePath } from "@/data/articles";
import { JsonLd, articleLd } from "@/lib/seo";

const fmt = (d) => new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
const anchor = (s) => s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ArticleView({ article: a }) {
  const locale = "nl";
  const c = t(locale);
  return (
    <>
      <PageHero
        locale={locale}
        title={a.title}
        text={a.description}
        trail={[
          { key: "kennisbank", label: c.nav.kennisbank },
          { path: articlePath(a.slug), label: a.title },
        ]}
      />
      <article className="py-12 md:py-20">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.95rem] text-muted">
              <time dateTime={a.date}>{fmt(a.date)}</time>
              <span className="inline-flex items-center gap-1.5"><Clock size={18} /> {a.minutes} min lezen</span>
            </p>
            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded">
              <Image src={IMAGES[a.image]} alt="" fill priority sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
            </div>

            <nav aria-label="Inhoud" className="mt-10 rounded bg-soft p-6">
              <p className="font-bold text-brand">In dit artikel</p>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-ink">
                {a.sections.map((s) => (
                  <li key={s.h}><a href={`#${anchor(s.h)}`} className="hover:text-accent hover:underline">{s.h}</a></li>
                ))}
              </ol>
            </nav>

            {a.sections.map((s) => (
              <section key={s.h} id={anchor(s.h)} className="mt-12">
                <h2 className="text-[1.6rem] md:text-[1.85rem]">{s.h}</h2>
                {s.p.map((para) => (
                  <p key={para.slice(0, 40)} className="mt-4 max-w-[70ch] text-[1.08rem] leading-relaxed text-ink/85">{para}</p>
                ))}
                {s.list && (
                  <ul className="mt-5 space-y-3">
                    {s.list.map((li) => (
                      <li key={li} className="flex items-start gap-3 text-[1.08rem]">
                        <CheckCircle size={24} weight="fill" className="mt-0.5 shrink-0 text-band" />
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <div className="mt-14 rounded bg-band p-8 text-white md:p-10">
              <p className="text-[1.4rem] font-bold">{c.finalCta.title}</p>
              <p className="mt-3 text-white/90">{c.finalCta.text}</p>
              <Link href={href("offer", locale)} className="btn mt-6">{c.cta}</Link>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <LeadForm locale={locale} source={`article-${a.slug}`} />
          </aside>
        </div>
      </article>
      <ArticleTeaser locale={locale} exclude={a.slug} tone="soft" />
      <JsonLd data={articleLd(a)} />
    </>
  );
}
