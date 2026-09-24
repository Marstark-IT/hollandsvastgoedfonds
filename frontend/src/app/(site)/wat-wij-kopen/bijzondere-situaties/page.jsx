import SegmentView from "@/components/views/SegmentView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("special", "nl");

export default function Page() {
  return <SegmentView locale="nl" segment="special" />;
}
