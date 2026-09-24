import SegmentView from "@/components/views/SegmentView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("industrial", "nl");

export default function Page() {
  return <SegmentView locale="nl" segment="industrial" />;
}
