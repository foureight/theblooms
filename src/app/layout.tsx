import type { Metadata } from "next";
import { Encode_Sans_Expanded, Figtree, Instrument_Serif } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CartProvider } from "@/lib/cart";
import { site } from "@/data/site";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const instrument = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

/** Closest free stand-in for Acumin Pro Wide (brand name + Alena) */
const encodeExpanded = Encode_Sans_Expanded({
  variable: "--font-name",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — floristické studio`,
    template: `%s · ${site.name}`,
  },
  description: site.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body
        className={`${figtree.variable} ${instrument.variable} ${encodeExpanded.variable} antialiased`}
      >
        <CartProvider>
          <SiteHeader />
          <main className="min-h-[70vh]">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
