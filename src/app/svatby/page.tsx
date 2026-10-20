import type { Metadata } from "next";
import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { CmsImage } from "@/components/cms-image";
import { DecorationCarousel } from "@/components/decoration-carousel";
import { FadeIn } from "@/components/fade-in";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { weddingFaqs } from "@/data/faqs";
import { site } from "@/data/site";
import {
  getCmsContent,
  mergeDecorations,
  mergeWeddings,
  seoFrom,
  slotFrom,
  textFrom,
} from "@/lib/cms/content";
import {
  absoluteUrl,
  absoluteUrls,
  breadcrumbJsonLd,
  faqJsonLd,
  floristOrganization,
  ogImages,
  serviceJsonLd,
} from "@/lib/seo";
import { Typo } from "@/components/typo";

const SVATBY_HERO_FALLBACK =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=80";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getCmsContent();
  const seo = seoFrom(cms, "svatby");
  const hero = slotFrom(cms, "svatby.hero", SVATBY_HERO_FALLBACK);
  const images = ogImages(hero, `Svatební floristika · ${site.name}`);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/svatby" },
    keywords: [
      "svatební floristika",
      "svatební floristika Praha",
      "svatební kytice",
      "svatební výzdoba",
      "svatební dekorace",
      "THE BLOOMS",
      "Alena Šmejkalová",
    ],
    openGraph: {
      title: `Svatební floristika · ${site.name}`,
      description: seo.description,
      type: "website",
      locale: "cs_CZ",
      url: absoluteUrl("/svatby"),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `Svatební floristika · ${site.name}`,
      description: seo.description,
      images: [absoluteUrl(hero)],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function SvatbyPage() {
  const cms = await getCmsContent();
  const seo = seoFrom(cms, "svatby");
  const weddings = mergeWeddings(cms);
  const decorations = mergeDecorations(cms);
  const hero = slotFrom(cms, "svatby.hero", SVATBY_HERO_FALLBACK);

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Úvod", path: "/" },
      { name: "Svatební floristika", path: "/svatby" },
    ]),
    serviceJsonLd({
      name: "Svatební floristika a dekorace",
      description: seo.description,
      path: "/svatby",
      serviceType: "Svatební floristika",
    }),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Svatební floristika THE BLOOMS",
      description: seo.description,
      url: absoluteUrl("/svatby"),
      inLanguage: "cs-CZ",
      about: floristOrganization(),
      isPartOf: { "@id": `${absoluteUrl("/")}/#website` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: absoluteUrl(hero),
      },
      mainEntity: {
        "@type": "ItemList",
        name: "Svatební realizace",
        numberOfItems: weddings.length,
        itemListElement: weddings.map((w, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: absoluteUrl(`/svatby/${w.slug}`),
          name: w.title,
          image: absoluteUrls(w.cover),
        })),
      },
    },
    faqJsonLd(weddingFaqs),
  ];

  return (
    <div>
      <JsonLd data={jsonLd} />

      <div className="relative h-[45svh] min-h-[280px] w-full overflow-hidden">
        <CmsImage
          src={hero}
          alt="Svatební floristika THE BLOOMS — kytice a dekorace"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-moss-deep/40" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8">
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/70 sm:text-xs">
            Poptávka · Praha
          </p>
          <h1 className="mt-2 font-display text-4xl text-white sm:text-6xl md:text-7xl">
            Svatební floristika
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-14 pb-0 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {textFrom(cms, "svatby.intro")}
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            <Typo>
              {`Za studiem ${site.name} stojí floristka ${site.owner} (Praha – Nusle). Každá svatba je individuální poptávka — bez balíčků z katalogu a bez kamenné prodejny. Realizace po celé ČR.`}
            </Typo>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaLink href="/kontakt?typ=svatba">Poptat svatbu</CtaLink>
            <CtaLink href="/svatby/cenik" variant="ghost">
              Orientační ceník
            </CtaLink>
            <CtaLink href="#realizace" variant="ghost">
              Prohlédnout realizace
            </CtaLink>
          </div>
        </FadeIn>

        <section className="mt-16 sm:mt-20" aria-labelledby="svatby-postup">
          <FadeIn>
            <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground sm:text-xs">
              Jak to probíhá
            </p>
            <h2
              id="svatby-postup"
              className="mt-2 font-display text-3xl text-moss-deep sm:text-4xl md:text-5xl"
            >
              Od poptávky po realizaci
            </h2>
          </FadeIn>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              {
                n: "01",
                title: "Poptávka",
                text: "Napište datum, místo a představu o stylu. Ozvu se s dalšími otázkami.",
              },
              {
                n: "02",
                title: "Návrh a rozsah",
                text: "Domluvíme floristiku, dekorace z inventáře a orientační rozpočet na míru.",
              },
              {
                n: "03",
                title: "Realizace",
                text: "V den svatby zajistím instalaci na místě — od kytice po obřad a hostinu.",
              },
            ].map((step) => (
              <li key={step.n} className="border-t border-bloom/35 pt-5">
                <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                  {step.n}
                </p>
                <h3 className="mt-2 font-display text-2xl text-moss-deep sm:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="realizace"
          className="mt-24 scroll-mt-24"
          aria-labelledby="svatby-realizace"
        >
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
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Ukázky svatební floristiky — styl, sezóna a místo. Podobný koncept
              domluvíme přes poptávku.
            </p>
          </FadeIn>
          <div className="mt-12 grid gap-10 sm:grid-cols-2">
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
                    <p className="text-[10px] font-normal tracking-[0.14em] uppercase text-muted-foreground sm:text-xs">
                      {w.season}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{w.place}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>

        <section id="dekorace" className="mt-32 scroll-mt-24">
          <FadeIn>
            <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground sm:text-xs">
              Inventář
            </p>
            <h2 className="mt-2 font-display text-4xl text-moss-deep sm:text-5xl md:text-6xl">
              Dekorace
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              <Typo>
                Vlastní inventář, který můžu nabídnout v rámci svatby.
                Rozklikněte kategorii, vyberte varianty a pošlete poptávku.
              </Typo>
            </p>
          </FadeIn>
          <div className="mt-12">
            <DecorationCarousel items={decorations} />
          </div>
        </section>

        <FadeIn>
          <section className="mt-28">
            <h2 className="font-display text-4xl text-moss-deep text-balance sm:text-5xl md:text-6xl">
              Domluvíme vaši svatbu
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              <Typo>
                Napište datum, místo a představu. Ozvu se a společně nastavíme
                rozsah floristiky i dekorací.
              </Typo>
            </p>
            <CtaLink href="/kontakt?typ=svatba" className="mt-8">
              Poptat svatbu
            </CtaLink>
          </section>
        </FadeIn>
      </div>

      <FaqSection faqs={weddingFaqs} />
    </div>
  );
}
