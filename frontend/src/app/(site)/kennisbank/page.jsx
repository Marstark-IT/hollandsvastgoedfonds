import KennisbankView from "@/components/views/KennisbankView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("kennisbank", "nl");

export default function Page() {
  return <KennisbankView locale="nl" />;
}
