import type { Metadata } from "next";
import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { FadeIn } from "@/components/fade-in";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { Typo } from "@/components/typo";
import { WreathCatalog } from "@/components/wreath-catalog";
import { adventWreathFaqs } from "@/data/faqs";
import { site } from "@/data/site";
import { getCmsContent, mergeWreaths } from "@/lib/cms/content";
import {
  absoluteUrl,
  absoluteUrls,
  breadcrumbJsonLd,
  faqJsonLd,
  floristOrganization,
} from "@/lib/seo";

const pageDescription =
  "Adventní věnce THE BLOOMS — koupit online od floristky Aleny Šmejkalové. Klasické i moderní adventní věnce s fotografií, cenou a dostupností. Doprava Zásilkovnou po Česku.";

export const metadata: Metadata = {
  title: "Adventní věnce — koupit online",
  description: pageDescription,
  alternates: { canonical: "/vence/advent" },
  keywords: [
    "adventní věnce",
    "adventní věnec",
    "koupit adventní věnec",
    "adventní věnec online",
    "THE BLOOMS",
    "Alena Šmejkalová",
  ],
  openGraph: {
    title: `Adventní věnce · ${site.name}`,
    description: pageDescription,
    type: "website",
    locale: "cs_CZ",
    url: absoluteUrl("/vence/advent"),
  },
};

export const dynamic = "force-dynamic";

export default async function AdventWreathsPage() {
  const cms = await getCmsContent();
  const advent = mergeWreaths(cms)
    .filter((w) => w.season === "Advent")
    .sort((a, b) => Number(b.available) - Number(a.available));
  const inStock = advent.filter((w) => w.available).length;
  const fromPrice = advent.length
    ? Math.min(...advent.map((w) => w.price))
    : null;

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Úvod", path: "/" },
      { name: "Věnce", path: "/vence" },
      { name: "Adventní věnce", path: "/vence/advent" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Adventní věnce THE BLOOMS",
      description: pageDescription,
      url: absoluteUrl("/vence/advent"),
      inLanguage: "cs-CZ",
      about: floristOrganization(),
      isPartOf: { "@type": "WebPage", url: absoluteUrl("/vence") },
      mainEntity: {
        "@type": "ItemList",
        name: "Adventní věnce",
        numberOfItems: advent.length,
        itemListElement: advent.map((w, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: w.name,
            description: w.description,
            image: absoluteUrls(w.image),
            url: absoluteUrl(`/vence/${w.slug}`),
            sku: w.slug,
            category: "Adventní věnec",
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
    faqJsonLd(adventWreathFaqs),
  ];

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-0 sm:px-6 sm:pt-14 lg:px-8">
        <JsonLd data={jsonLd} />
        <FadeIn>
          <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground sm:text-xs">
            Sezóna · Advent
          </p>
          <h1 className="mt-3 font-display text-4xl text-moss-deep sm:text-6xl md:text-7xl">
            Adventní věnce
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            <Typo>
              {`Hotové adventní věnce z dílny ${site.owner}. Koupíte online — s fotografií, cenou, rozměrem a aktuální dostupností. Doprava Zásilkovnou po celé ČR.`}
            </Typo>
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {inStock > 0 ? (
              <>
                Teď skladem{" "}
                <span className="font-medium text-foreground">
                  {inStock} {inStock === 1 ? "věnec" : inStock < 5 ? "věnce" : "věnců"}
                </span>
                {fromPrice != null ? (
                  <>
                    {" "}
                    · od {fromPrice.toLocaleString("cs-CZ")}&nbsp;Kč
                  </>
                ) : null}
                .
              </>
            ) : (
              <>
                Adventní nabídka se připravuje — sledujte dostupnost u jednotlivých
                věnců, nebo napište poptávku.
              </>
            )}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaLink href="#nabidka">Prohlédnout nabídku</CtaLink>
            <CtaLink href="/vence" variant="ghost">
              Všechny sezónní věnce
            </CtaLink>
          </div>
        </FadeIn>

        <div id="nabidka" className="mt-10 scroll-mt-24 sm:mt-12">
          <h2 className="sr-only">Nabídka adventních věnců</h2>
          <WreathCatalog
            items={advent}
            initialSeason="Advent"
            hideFilters
          />
        </div>

        <p className="mt-12 text-sm text-muted-foreground">
          Hledáte jarní nebo podzimní věnec?{" "}
          <Link
            href="/vence"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Celý e-shop věnců
          </Link>
          .
        </p>
      </div>
      <FaqSection faqs={adventWreathFaqs} />
    </>
  );
}
