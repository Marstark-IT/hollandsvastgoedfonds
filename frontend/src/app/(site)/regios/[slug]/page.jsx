import { notFound } from "next/navigation";
import RegionView from "@/components/views/RegionView";
import { REGIONS, regionBySlug } from "@/data/regions";
import { regionMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => REGIONS.map((r) => ({ slug: r.slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return regionMetadata(regionBySlug(slug));
}

export default async function Page({ params }) {
  const { slug } = await params;
  const region = regionBySlug(slug);
  if (!region) notFound();
  return <RegionView region={region} />;
}
