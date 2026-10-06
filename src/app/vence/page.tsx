import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { WreathCatalog } from "@/components/wreath-catalog";
import { site } from "@/data/site";
import {
  getCmsContent,
  mergeWreaths,
  textFrom,
} from "@/lib/cms/content";
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

export const dynamic = "force-dynamic";

export default async function VencePage() {
  const cms = await getCmsContent();
  const wreaths = mergeWreaths(cms);

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <JsonLd data={jsonLd} />
      <FadeIn>
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground sm:text-xs">
          E-shop
        </p>
        <h1 className="mt-3 font-display text-4xl text-moss-deep sm:text-6xl md:text-7xl">
          Věnce
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {textFrom(cms, "vence.intro")}
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Věnce jsou hotové floristické výrobky studia {site.name}. Ostatní
          služby (svatby, kytky, eventy, workshopy) řešíme přes poptávku.
        </p>
      </FadeIn>
      <div className="mt-10 sm:mt-12">
        <h2 className="sr-only">Nabídka věnců</h2>
        <WreathCatalog items={wreaths} />
      </div>
      <FaqSection faqs={faqs} />
    </div>
  );
}
