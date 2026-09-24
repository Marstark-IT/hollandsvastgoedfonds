import BuyView from "@/components/views/BuyView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("buy", "nl");

export default function Page() {
  return <BuyView locale="nl" />;
}
