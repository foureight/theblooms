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

export function floristOrganization() {
  return {
    "@type": "Florist" as const,
    "@id": `${siteUrl}/#organization`,
    name: site.name,
    alternateName: "THE BLOOMS floristické studio",
    url: siteUrl,
    email: site.email,
    telephone: site.phone,
    image: absoluteUrl("/theblooms.svg"),
    logo: absoluteUrl("/theblooms.svg"),
    founder: {
      "@type": "Person",
      name: site.owner,
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "CZ",
    },
    areaServed: {
      "@type": "Country",
      name: "Česko",
    },
    sameAs: [site.instagram],
    description: site.tagline,
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
    areaServed: {
      "@type": "Country",
      name: "Česko",
    },
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
