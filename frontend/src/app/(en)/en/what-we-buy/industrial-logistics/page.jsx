import SegmentView from "@/components/views/SegmentView";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("industrial", "en");

export default function Page() {
  return <SegmentView locale="en" segment="industrial" />;
}
