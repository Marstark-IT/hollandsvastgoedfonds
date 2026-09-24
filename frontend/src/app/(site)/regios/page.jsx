import RegionsView from "@/components/views/RegionsView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("regions", "nl");

export default function Page() {
  return <RegionsView locale="nl" />;
}
