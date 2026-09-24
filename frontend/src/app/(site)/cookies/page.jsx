import LegalView from "@/components/views/LegalView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("cookies", "nl");

export default function Page() {
  return <LegalView locale="nl" page="cookies" />;
}
