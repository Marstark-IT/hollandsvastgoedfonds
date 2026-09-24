import "../globals.css";
import { Roboto } from "next/font/google";
import Shell from "@/components/layout/Shell";
import { baseMetadata, JsonLd, organizationLd, websiteLd } from "@/lib/seo";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = baseMetadata("nl");

export const viewport = { themeColor: "#0F3B5F" };

// Root layout for the Dutch site. Two root layouts (Dutch and English) so
// each language gets the correct <html lang>.
export default function RootLayout({ children }) {
  return (
    <html lang="nl" className={roboto.variable}>
      <body>
        <JsonLd data={[organizationLd("nl"), websiteLd("nl")]} />
        <Shell locale="nl">{children}</Shell>
      </body>
    </html>
  );
}
