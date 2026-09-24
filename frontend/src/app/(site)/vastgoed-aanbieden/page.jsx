import OfferView from "@/components/views/OfferView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("offer", "nl");

export default function Page() {
  return <OfferView locale="nl" />;
}
