import ApproachView from "@/components/views/ApproachView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("approach", "en");

export default function Page() {
  return <ApproachView locale="en" />;
}
