import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { WreathCatalog } from "@/components/wreath-catalog";
import { wreathFaqs } from "@/data/faqs";
import { site } from "@/data/site";
import {
  getCmsContent,
  mergeWreaths,
  textFrom,
} from "@/lib/cms/content";
import {
  absoluteUrl,
  absoluteUrls,
  breadcrumbJsonLd,
  faqJsonLd,
  firstShareImage,
  floristOrganization,
  ogImages,
} from "@/lib/seo";
import { Typo } from "@/components/typo";

const pageDescription =
  "Sezónní věnce THE BLOOMS — jarní, letní, podzimní i adventní. Fotografie, cena, rozměr a dostupnost. Kupte věnec online od floristky Aleny Šmejkalové.";

const VENCE_OG_FALLBACK = "/wreaths/advent-pudrovy-masle.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getCmsContent();
  const wreaths = mergeWreaths(cms);
  const share = firstShareImage(wreaths, VENCE_OG_FALLBACK);
  const images = ogImages(share, `Sezónní věnce · ${site.name}`);
  return {
    title: "Sezónní věnce — e-shop",
    description: pageDescription,
    alternates: { canonical: "/vence" },
    openGraph: {
      title: `Sezónní věnce · ${site.name}`,
      description: pageDescription,
      type: "website",
      locale: "cs_CZ",
      images,
    },
    twitter: {
      card: "summary_large_image",
      images: [absoluteUrl(share)],
    },
  };
}

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
            image: absoluteUrls(w.image),
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
    faqJsonLd(wreathFaqs),
  ];

  return (
    <>
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-0 sm:px-6 sm:pt-14 lg:px-8">
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
          <Typo>
            {`Věnce jsou hotové floristické výrobky studia ${site.name}. Ostatní služby (svatby, kytky, eventy, workshopy) řešíme přes poptávku.`}
          </Typo>
        </p>
        <p className="mt-5 text-sm text-moss-deep">
          <Link
            href="/vence/advent"
            className="underline underline-offset-4 decoration-bloom/50 hover:decoration-bloom"
          >
            Adventní věnce →
          </Link>
          <span className="text-muted-foreground">
            {" "}
            sezónní výběr koupíte online
          </span>
        </p>
      </FadeIn>
      <div className="mt-10 sm:mt-12">
        <h2 className="sr-only">Nabídka věnců</h2>
        <WreathCatalog items={wreaths} />
      </div>
    </div>
    <FaqSection faqs={wreathFaqs} />
    </>
  );
}
