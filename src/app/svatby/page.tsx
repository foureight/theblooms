import type { Metadata } from "next";
import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { CmsImage } from "@/components/cms-image";
import { DecorationCarousel } from "@/components/decoration-carousel";
import { FadeIn } from "@/components/fade-in";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/data/site";
import {
  getCmsContent,
  mergeDecorations,
  mergeWeddings,
  slotFrom,
  textFrom,
} from "@/lib/cms/content";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  floristOrganization,
  serviceJsonLd,
} from "@/lib/seo";

const pageDescription =
  "Svatební floristika THE BLOOMS: celý květinový a dekorační koncept svatby — kytice, obřad, hostina, instalace a vlastní inventář. Poptávka u Aleny Šmejkalové.";

export const metadata: Metadata = {
  title: "Svatební floristika a dekorace",
  description: pageDescription,
  keywords: [
    "svatební floristika",
    "svatební dekorace",
    "květiny na svatbu",
    "svatební kytice",
    "obřadní brána",
    "THE BLOOMS",
    "Alena Šmejkalová",
  ],
  alternates: { canonical: "/svatby" },
  openGraph: {
    title: `Svatební floristika · ${site.name}`,
    description: pageDescription,
    type: "website",
    locale: "cs_CZ",
  },
};

const faqs = [
  {
    question: "Co všechno řešíte u svatby?",
    answer:
      "Celý floristický a dekorační koncept: svatební kytici, obřadní instalace, stoly, brány, vázy, svícny, textil a další dekorace z vlastního inventáře — nebo realizaci podle vaší představy.",
  },
  {
    question: "Jak probíhá poptávka svatby?",
    answer:
      "Přes kontaktní formulář napište datum, místo a základní představu. Ozvu se s dalšími otázkami a návrhem rozsahu. Objednání neprobíhá přes e-shop.",
  },
  {
    question: "Máte vlastní inventář dekorací?",
    answer:
      "Ano. V rámci svatby můžu nabídnout vázy, svícny, svíčky, nádoby, brány, textil a další kusy z vlastního inventáře.",
  },
  {
    question: "Kde THE BLOOMS svatby realizuje?",
    answer:
      "Floristické studio THE BLOOMS působí v České republice. Konkrétní lokalitu a logistiku domlouváme individuálně podle místa svatby.",
  },
];

export const dynamic = "force-dynamic";

export default async function SvatbyPage() {
  const cms = await getCmsContent();
  const weddings = mergeWeddings(cms);
  const decorations = mergeDecorations(cms);
  const hero = slotFrom(
    cms,
    "svatby.hero",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=80",
  );

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Úvod", path: "/" },
      { name: "Svatby", path: "/svatby" },
    ]),
    serviceJsonLd({
      name: "Svatební floristika a dekorace",
      description: pageDescription,
      path: "/svatby",
      serviceType: "Svatební floristika",
    }),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Svatební realizace THE BLOOMS",
      url: absoluteUrl("/svatby"),
      isPartOf: { "@id": `${absoluteUrl("/")}/#website` },
      about: floristOrganization(),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: weddings.map((w, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: absoluteUrl(`/svatby/${w.slug}`),
          name: w.title,
        })),
      },
    },
    faqJsonLd(faqs),
  ];

  return (
    <div>
      <JsonLd data={jsonLd} />

      <div className="relative h-[45svh] min-h-[280px] overflow-hidden">
        <CmsImage
          src={hero}
          alt="Svatební floristika a dekorace THE BLOOMS"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-moss-deep/40" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <h1 className="font-display text-6xl text-white sm:text-7xl">
            Svatby
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-lg">
            {textFrom(cms, "svatby.intro")}
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Za studiem {site.name} stojí floristka {site.owner}. Každá svatba je
            individuální poptávka — bez balíčků z katalogu a bez kamenné
            prodejny.
          </p>
          <CtaLink href="/kontakt?typ=svatba" className="mt-8">
            Poptat svatbu
          </CtaLink>
        </FadeIn>

        <section className="mt-16" aria-labelledby="svatby-realizace">
          <FadeIn>
            <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground sm:text-xs">
              Galerie
            </p>
            <h2
              id="svatby-realizace"
              className="mt-2 font-display text-4xl text-moss-deep sm:text-5xl md:text-6xl"
            >
              Realizace
            </h2>
          </FadeIn>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {weddings.map((w, i) => (
              <FadeIn key={w.slug} delay={(i % 2) * 80}>
                <Link href={`/svatby/${w.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <CmsImage
                      src={w.cover}
                      alt={`Svatební floristika ${w.title} — ${w.place}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-2xl text-moss-deep sm:text-3xl md:text-4xl">
                      {w.title}
                    </h3>
                    <h4 className="text-[10px] font-normal tracking-[0.14em] uppercase text-muted-foreground sm:text-xs">
                      {w.season}
                    </h4>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{w.place}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>

        <section id="dekorace" className="mt-24 scroll-mt-24">
          <FadeIn>
            <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground sm:text-xs">
              Inventář
            </p>
            <h2 className="mt-2 font-display text-4xl text-moss-deep sm:text-5xl md:text-6xl">
              Dekorace
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Vlastní inventář, který můžu nabídnout v rámci svatby. Rozklikněte
              kategorii, vyberte varianty a pošlete poptávku.
            </p>
          </FadeIn>
          <div className="mt-10">
            <DecorationCarousel items={decorations} />
          </div>
        </section>

        <FaqSection faqs={faqs} />

        <FadeIn>
          <section className="mt-20 border-t border-bloom/30 pt-12">
            <h2 className="font-display text-4xl text-moss-deep text-balance sm:text-5xl md:text-6xl">
              Domluvíme vaši svatbu
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              Napište datum, místo a představu. Ozvu se a společně nastavíme
              rozsah floristky i dekorací.
            </p>
            <CtaLink href="/kontakt?typ=svatba" className="mt-8">
              Poptat svatbu
            </CtaLink>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
