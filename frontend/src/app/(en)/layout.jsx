import "../globals.css";
import { Roboto } from "next/font/google";
import Shell from "@/components/layout/Shell";
import { GtmHead, GtmNoScript } from "@/components/analytics/GoogleTagManager";
import { baseMetadata, JsonLd, organizationLd, websiteLd } from "@/lib/seo";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = baseMetadata("en");

export const viewport = { themeColor: "#0F3B5F" };

// Root layout for the English site. Two root layouts (Dutch and English) so
// each language gets the correct <html lang>.
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.variable}>
      <head>
        <GtmHead />
      </head>
      <body>
        <GtmNoScript />
        <JsonLd data={[organizationLd("en"), websiteLd("en")]} />
        <Shell locale="en">{children}</Shell>
      </body>
    </html>
  );
}
