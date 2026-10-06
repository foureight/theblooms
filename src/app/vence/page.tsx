import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { WreathCatalog } from "@/components/wreath-catalog";
import { site } from "@/data/site";
import { wreaths } from "@/data/wreaths";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  floristOrganization,
} from "@/lib/seo";

const pageDescription =
  "Sezónní věnce THE BLOOMS — jarní, letní, podzimní i adventní. Fotografie, cena, rozměr a dostupnost. Kupte věnec online od floristky Aleny Šmejkalové.";

export const metadata: Metadata = {
  title: "Sezónní věnce — e-shop",
  description: pageDescription,
  keywords: [
    "věnce",
    "adventní věnec",
    "jarní věnec",
    "podzimní věnec",
    "věnec na dveře",
    "THE BLOOMS",
    "koupit věnec",
  ],
  alternates: { canonical: "/vence" },
  openGraph: {
    title: `Sezónní věnce · ${site.name}`,
    description: pageDescription,
    type: "website",
    locale: "cs_CZ",
  },
};

const faqs = [
  {
    question: "Jak se věnce objednávají?",
    answer:
      "Věnce jsou jediná část nabídky THE BLOOMS, kterou koupíte přímo na webu. Vyberete věnec, přidáte do košíku a dokončíte objednávku.",
  },
  {
    question: "Mění se nabídka podle sezóny?",
    answer:
      "Ano. Věnce připravuji sezónně — jaro, léto, podzim i advent. U každého věnce vidíte fotografii, cenu, rozměr a aktuální dostupnost.",
  },
  {
    question: "Jsou adventní věnce dostupné celý rok?",
    answer:
      "Ne. Adventní věnce jsou sezónní nabídka a bývají dostupné od listopadu. Mimo sezónu je u nich uvedená nedostupnost.",
  },
  {
    question: "Děláte i věnce na míru?",
    answer:
      "Hotové věnce jsou v e-shopu. Individuální přání nebo větší množství řešíme přes poptávku v kontaktu.",
  },
];

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Úvod", path: "/" },
    { name: "Věnce", path: "/vence" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Sezónní věnce THE BLOOMS",
    description: pageDescription,
    url: absoluteUrl("/vence"),
    about: floristOrganization(),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: wreaths.length,
      itemListElement: wreaths.map((w, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: w.name,
          description: w.description,
          image: w.image,
          url: absoluteUrl(`/vence/${w.slug}`),
          sku: w.slug,
          brand: { "@type": "Brand", name: site.name },
          offers: {
            "@type": "Offer",
            priceCurrency: "CZK",
            price: String(w.price),
            availability: w.available
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: absoluteUrl(`/vence/${w.slug}`),
          },
        },
      })),
    },
  },
  faqJsonLd(faqs),
];

export default function VencePage() {
  return (
    <div>
      <JsonLd data={jsonLd} />
      <PageHero
        title="Věnce"
        eyebrow="E-shop"
        image="https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1800&q=80"
        imageAlt="Sezónní věnce THE BLOOMS"
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <FadeIn>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Nabídka se mění podle sezóny. Každý věnec má fotografii, cenu, rozměr
            a dostupnost — vyberete a koupíte přímo zde.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Věnce jsou hotové floristické výrobky studia {site.name}. Ostatní
            služby (svatby, kytky, eventy, workshopy) řešíme přes poptávku.
          </p>
        </FadeIn>
        <div className="mt-10 sm:mt-12">
          <WreathCatalog />
        </div>
        <FaqSection faqs={faqs} />
      </div>
    </div>
  );
}
