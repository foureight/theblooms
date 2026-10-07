import type { Metadata, Viewport } from "next";
import { Encode_Sans_Expanded } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CartProvider } from "@/lib/cart";
import { site } from "@/data/site";
import { defaultOgImage, siteUrl } from "@/lib/seo";
import "./globals.css";

/**
 * Encode Sans Expanded = fallback if Typekit is blocked.
 * Primary typeface is Acumin Pro Wide via kit zwe5oqo (with Czech).
 */
const encodeExpanded = Encode_Sans_Expanded({
  variable: "--font-name-fallback",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const typekitId = process.env.NEXT_PUBLIC_TYPEKIT_ID?.trim() || "zwe5oqo";

export const viewport: Viewport = {
  themeColor: "#42856c",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — floristické studio`,
    template: `%s · ${site.name}`,
  },
  description: site.tagline,
  applicationName: site.name,
  authors: [{ name: site.owner, url: `${siteUrl}/o-mne` }],
  creator: site.owner,
  publisher: site.name,
  icons: {
    icon: [{ url: "/theblooms-flower.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    siteName: site.name,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${site.name} — floristické studio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [defaultOgImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
        <link rel="stylesheet" href={`https://use.typekit.net/${typekitId}.css`} />
        {/* Ensures Adobe Fonts kit is requested with the page origin */}
        <link
          rel="preload"
          as="style"
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
