import ThanksView from "@/components/views/ThanksView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("thanks", "en");

export default function Page() {
  return <ThanksView locale="en" />;
}
