import LegalView from "@/components/views/LegalView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("disclaimer", "nl");

export default function Page() {
  return <LegalView locale="nl" page="disclaimer" />;
}
