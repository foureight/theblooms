import type { Metadata } from "next";
import { CtaLink } from "@/components/cta-link";
import { CmsImage } from "@/components/cms-image";
import { FadeIn } from "@/components/fade-in";
import { JsonLd } from "@/components/json-ld";
import { Typo } from "@/components/typo";
import {
  weddingDecorPrices,
  weddingFlowerPrices,
  type PriceRow,
} from "@/data/wedding-price-list";
import { site } from "@/data/site";
import { getCmsContent, seoFrom, slotFrom } from "@/lib/cms/content";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  floristOrganization,
  ogImages,
} from "@/lib/seo";

const CENIK_HERO_FALLBACK =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=80";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getCmsContent();
  const seo = seoFrom(cms, "svatby-cenik");
  const hero = slotFrom(cms, "svatby.cenik", CENIK_HERO_FALLBACK);
  const images = ogImages(hero, `${seo.title} · ${site.name}`);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/svatby/cenik" },
    keywords: [
      "svatební floristika ceník",
      "cena svatební kytice",
      "svatební výzdoba cena",
      "orientační ceník floristiky",
      "THE BLOOMS",
    ],
    openGraph: {
      title: `${seo.title} · ${site.name}`,
      description: seo.description,
      type: "website",
      locale: "cs_CZ",
      url: absoluteUrl("/svatby/cenik"),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${seo.title} · ${site.name}`,
      description: seo.description,
      images: [absoluteUrl(hero)],
    },
  };
}

export const dynamic = "force-dynamic";

function PriceTable({
  caption,
  colA,
  colB,
  rows,
}: {
  caption: string;
  colA: string;
  colB: string;
  rows: PriceRow[];
}) {
  return (
    <div>
      <h2 className="font-display text-3xl text-moss-deep sm:text-4xl">
        {caption}
      </h2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 pr-4 text-[10px] font-medium tracking-[0.16em] uppercase text-muted-foreground">
                {colA}
              </th>
              <th className="py-3 text-right text-[10px] font-medium tracking-[0.16em] uppercase text-muted-foreground">
                {colB}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.item} className="border-b border-border/70">
                <td className="py-3.5 pr-4 text-foreground">{row.item}</td>
                <td className="py-3.5 text-right whitespace-nowrap text-moss-deep">
                  {row.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function WeddingPriceListPage() {
  const cms = await getCmsContent();
  const seo = seoFrom(cms, "svatby-cenik");
  const hero = slotFrom(cms, "svatby.cenik", CENIK_HERO_FALLBACK);

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Úvod", path: "/" },
      { name: "Svatební floristika", path: "/svatby" },
      { name: "Orientační ceník", path: "/svatby/cenik" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: seo.title,
      description: seo.description,
      url: absoluteUrl("/svatby/cenik"),
      inLanguage: "cs-CZ",
      about: floristOrganization(),
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: absoluteUrl(hero),
      },
    },
  ];

  return (
    <div>
      <JsonLd data={jsonLd} />

      <div className="relative h-[40svh] min-h-[240px] w-full overflow-hidden">
        <CmsImage
          src={hero}
          alt="Svatební floristika — orientační ceník"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-moss-deep/40" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8">
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/70 sm:text-xs">
            Svatby · Ceník
          </p>
          <h1 className="mt-2 font-display text-4xl text-white sm:text-5xl md:text-6xl">
            Orientační ceník svatební floristiky
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-14 pb-24 sm:px-6 sm:pb-28 lg:px-8 lg:pb-32">
        <FadeIn>
          <div className="max-w-2xl space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              <Typo>
                Každá svatba je jedinečná, a proto i květinovou výzdobu
                připravuji individuálně podle vašich představ a přání.
              </Typo>
            </p>
            <p>
              <Typo>
                Všechny uvedené ceny jsou orientační a představují minimální
                výchozí ceny jednotlivých služeb. Nejedná se o konečné ceny.
              </Typo>
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaLink href="/kontakt?typ=svatba">Poptat svatbu</CtaLink>
            <CtaLink href="/svatby" variant="ghost">
              Zpět na svatby
            </CtaLink>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-20">
          <FadeIn>
            <PriceTable
              caption="Svatební květiny"
              colA="Květinová dekorace"
              colB="Cena"
              rows={weddingFlowerPrices}
            />
          </FadeIn>
          <FadeIn>
            <PriceTable
              caption="Svatební výzdoba"
              colA="Služba"
              colB="Cena"
              rows={weddingDecorPrices}
            />
          </FadeIn>
        </div>

        <FadeIn>
          <div className="mt-10 max-w-2xl space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              <Typo>
                Kompletní výzdoba stolu zahrnuje květinové aranžmá a doplňkové
                dekorace podle dohodnutého stylu a rozsahu.
              </Typo>
            </p>
            <p>
              <Typo>
                Cena instalace a deinstalace se odvíjí od rozsahu výzdoby,
                časové náročnosti a podmínek na místě realizace.
              </Typo>
            </p>
          </div>
        </FadeIn>

        <section className="mt-24 max-w-2xl" aria-labelledby="cenik-jak">
          <FadeIn>
            <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground sm:text-xs">
              Kalkulace
            </p>
            <h2
              id="cenik-jak"
              className="mt-2 font-display text-3xl text-moss-deep sm:text-4xl md:text-5xl"
            >
              Jak se stanovuje konečná cena?
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                <Typo>
                  Uvedené ceny jsou pouze orientační ceny OD. Konečná cena může
                  být vyšší v závislosti na velikosti a bohatosti aranžmá, druhu
                  a sezónní dostupnosti květin, množství dekorací a náročnosti
                  realizace.
                </Typo>
              </p>
              <p>
                <Typo>
                  Celkovou cenu svatební výzdoby proto nelze určit předem bez
                  znalosti konkrétních požadavků.
                </Typo>
              </p>
              <p>
                <Typo>
                  Po úvodní konzultaci vám ráda připravím předběžnou kalkulaci
                  na míru.
                </Typo>
              </p>
              <p className="font-display text-xl text-moss-deep sm:text-2xl">
                <Typo>
                  Každá svatba je jiná. Společně najdeme řešení, které bude
                  odpovídat vašim představám i rozpočtu.
                </Typo>
              </p>
            </div>
            <CtaLink href="/kontakt?typ=svatba" className="mt-10">
              Domluvit konzultaci
            </CtaLink>
          </FadeIn>
        </section>
      </div>
    </div>
  );
}
