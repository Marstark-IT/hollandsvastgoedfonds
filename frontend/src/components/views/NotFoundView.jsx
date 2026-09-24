import Link from "next/link";
import { href } from "@/data/site";
import { t } from "@/data/content";

export default function NotFoundView({ locale }) {
  const p = t(locale).pages.notFound;
  return (
    <section className="py-24 md:py-32">
      <div className="wrap max-w-[760px] text-center">
        <p className="text-[4rem] font-extrabold text-band">404</p>
        <h1 className="mt-2 text-[2rem] md:text-[2.5rem]">{p.title}</h1>
        <p className="mt-5 text-[1.15rem] text-muted">{p.text}</p>
        <Link href={href("home", locale)} className="btn mt-10">{p.back}</Link>
      </div>
    </section>
  );
}
