import FaqView from "@/components/views/FaqView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("faq", "nl");

export default function Page() {
  return <FaqView locale="nl" />;
}
