import { site } from "@/data/site";

/** Canonical site origin — override with NEXT_PUBLIC_SITE_URL in production */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://theblooms.cz"
);

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Absolute URL(s) for JSON-LD image / media fields (relative paths break AI + Google). */
export function absoluteUrls(paths: string | string[]) {
  return (Array.isArray(paths) ? paths : [paths])
    .filter(Boolean)
    .map((path) => absoluteUrl(path));
}

export const defaultOgImage = absoluteUrl("/og.jpg");

/** Open Graph / Twitter image from a page hero or product photo (not the vizitka). */
export function ogImages(image: string, alt: string) {
  return [{ url: absoluteUrl(image), alt }];
}

/** Prefer in-stock catalog photo; skip SVG placeholders. */
export function firstShareImage(
  items: { image: string; available?: boolean }[],
  fallback: string,
) {
  const usable = (src: string) =>
    Boolean(src) &&
    !src.includes("placeholder.svg") &&
    !src.endsWith(".svg");
  const inStock = items.find((i) => i.available && usable(i.image));
  if (inStock) return inStock.image;
  const any = items.find((i) => usable(i.image));
  return any?.image || fallback;
}

export function floristOrganization() {
  return {
    "@type": ["Florist", "LocalBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: site.name,
    alternateName: "THE BLOOMS floristické studio",
    url: siteUrl,
    email: site.email,
    telephone: site.phone,
    image: absoluteUrl("/og.jpg"),
    logo: absoluteUrl("/theblooms.svg"),
    priceRange: "$$",
    currenciesAccepted: "CZK",
    paymentAccepted: "Platební karta, bankovní převod",
    founder: {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: site.owner,
      jobTitle: "Floristka",
      url: absoluteUrl("/o-mne"),
      sameAs: [site.instagram],
      worksFor: { "@id": `${siteUrl}/#organization` },
    },
    employee: {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: site.owner,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Praha",
      addressRegion: "Nusle",
      addressCountry: "CZ",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Praha",
      },
      {
        "@type": "Country",
        name: "Česko",
      },
    ],
    sameAs: [site.instagram],
    description: site.tagline,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phone,
      email: site.email,
      contactType: "customer service",
      availableLanguage: ["Czech", "cs"],
      areaServed: "CZ",
    },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: site.owner,
    jobTitle: "Floristka",
    url: absoluteUrl("/o-mne"),
    image: absoluteUrl("/og.jpg"),
    email: site.email,
    telephone: site.phone,
    sameAs: [site.instagram],
    worksFor: { "@id": `${siteUrl}/#organization` },
    knowsAbout: [
      "svatební floristika",
      "sezónní věnce",
      "květinové instalace",
      "floristické workshopy",
    ],
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function serviceJsonLd({
  name,
  description,
  path,
  serviceType,
  minPrice,
}: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  minPrice?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType,
    description,
    url: absoluteUrl(path),
    provider: floristOrganization(),
    areaServed: [
      { "@type": "City", name: "Praha" },
      { "@type": "Country", name: "Česko" },
    ],
    ...(minPrice
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "CZK",
            price: minPrice,
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "CZK",
              minPrice,
            },
            url: absoluteUrl(path),
          },
        }
      : {}),
  };
}

export type FaqItem = { question: string; answer: string };
