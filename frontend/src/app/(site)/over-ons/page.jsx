import AboutView from "@/components/views/AboutView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("about", "nl");

export default function Page() {
  return <AboutView locale="nl" />;
}
