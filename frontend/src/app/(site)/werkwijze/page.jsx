import ApproachView from "@/components/views/ApproachView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("approach", "nl");

export default function Page() {
  return <ApproachView locale="nl" />;
}
