import LegalView from "@/components/views/LegalView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("disclaimer", "en");

export default function Page() {
  return <LegalView locale="en" page="disclaimer" />;
}
