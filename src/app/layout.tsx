import type { Metadata } from "next";
import { Encode_Sans_Expanded } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CartProvider } from "@/lib/cart";
import { site } from "@/data/site";
import "./globals.css";

/**
 * Primary UI font with full Czech (latin-ext).
 * Typekit Acumin Pro Wide kit zwe5oqo is currently subset without CE glyphs
 * (Š/č/ř/ě/ů/ž…) — so Acumin is used only for ASCII brand wordmark.
 */
const encodeExpanded = Encode_Sans_Expanded({
  variable: "--font-name-fallback",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const typekitId = process.env.NEXT_PUBLIC_TYPEKIT_ID?.trim() || "zwe5oqo";

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
      <head>
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href={`https://use.typekit.net/${typekitId}.css`}
        />
      </head>
      <body className={`${encodeExpanded.variable} antialiased`}>
        <CartProvider>
          <SiteHeader />
          <main className="min-h-[70vh]">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
