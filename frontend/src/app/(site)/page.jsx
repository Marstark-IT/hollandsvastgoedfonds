import HomeView from "@/components/views/HomeView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("home", "nl");

export default function Page() {
  return <HomeView locale="nl" />;
}
