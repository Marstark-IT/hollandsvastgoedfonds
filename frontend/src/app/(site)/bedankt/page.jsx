import ThanksView from "@/components/views/ThanksView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("thanks", "nl");

export default function Page() {
  return <ThanksView locale="nl" />;
}
