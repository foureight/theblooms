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

/** Fallback when Adobe Fonts kit is not configured */
const encodeExpanded = Encode_Sans_Expanded({
  variable: "--font-name-fallback",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

const typekitId = process.env.NEXT_PUBLIC_TYPEKIT_ID?.trim();

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
        {typekitId ? (
          <>
            <link rel="preconnect" href="https://use.typekit.net" />
            <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
            {/* Adobe Fonts — Acumin Pro Wide Regular from Typekit web project */}
            <link
              rel="stylesheet"
              href={`https://use.typekit.net/${typekitId}.css`}
            />
          </>
        ) : null}
      </head>
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
