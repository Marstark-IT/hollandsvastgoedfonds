import NotFoundView from "@/components/views/NotFoundView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("notFound", "en");

export default function Page() {
  return <NotFoundView locale="en" />;
}
