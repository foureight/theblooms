import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { FadeIn } from "@/components/fade-in";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { weddings } from "@/data/weddings";
import { wreaths, formatPrice } from "@/data/wreaths";
import { site } from "@/data/site";
import {
  faqJsonLd,
  floristOrganization,
  siteUrl,
} from "@/lib/seo";

const pageDescription =
  "THE BLOOMS — floristické studio Aleny Šmejkalové pro svatby, větší květinové realizace a sezónní věnce. Osobní práce v dílně, věnce koupíte online.";

export const metadata: Metadata = {
  title: {
    absolute: `${site.name} — floristické studio pro svatby a věnce`,
  },
  description: pageDescription,
  keywords: [
    "floristické studio",
    "svatební floristika",
    "věnce",
    "kytky na míru",
    "THE BLOOMS",
    "Alena Šmejkalová",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} — floristické studio`,
    description: pageDescription,
    type: "website",
    locale: "cs_CZ",
    url: siteUrl,
  },
};

const faqs = [
  {
    question: "Je THE BLOOMS klasické květinářství?",
    answer:
      "Ne. Jde o floristické studio Aleny Šmejkalové. Svatby, větší kytky a eventy vznikají na objednávku přes poptávku; sezónní věnce koupíte v e-shopu.",
  },
  {
    question: "Co si můžu koupit online?",
    answer:
      "Online jsou sezónní věnce — s fotografií, cenou, rozměrem a dostupností. Ostatní služby řešíme individuálně.",
  },
  {
    question: "Jak poptám svatbu nebo kytky?",
    answer:
      "Přes stránku Kontakt. U svatby uveďte datum a místo, u kytek příležitost a představu. Ozvu se s dalšími detaily.",
  },
  {
    question: "Děláte i workshopy?",
    answer:
      "Ano. Květinové a věncové workshopy — přijedu domů, do firmy nebo na akci a přivezu vše potřebné.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: site.name,
    url: siteUrl,
    description: pageDescription,
    inLanguage: "cs-CZ",
    publisher: { "@id": `${siteUrl}/#organization` },
  },
  {
    "@context": "https://schema.org",
    ...floristOrganization(),
  },
  faqJsonLd(faqs),
];

export default function HomePage() {
  const featuredWeddings = weddings.slice(0, 3);
  const featuredWreaths = wreaths.filter((w) => w.available).slice(0, 3);

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="relative min-h-[100svh] overflow-hidden grain">
        <Image
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=2000&q=85"
          alt="Svatební květinová instalace"
          fill
          priority
          className="hero-media object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24">
          <h1 className="reveal max-w-3xl font-sans text-4xl font-normal tracking-wide text-white sm:text-5xl md:text-6xl md:leading-[1.05]">
            Floristické studio pro svatby, větší květinové realizace nebo věnce
          </h1>
          <p className="reveal reveal-delay-1 mt-3 max-w-lg text-base leading-relaxed text-white/70">
            Nejsem klasické květinářství — osobní práce v dílně, od celého
            svatebního konceptu po sezónní věnce.
          </p>
          <div className="reveal reveal-delay-2 mt-8 flex flex-wrap gap-3">
            <CtaLink
              href="/svatby"
              className="bg-moss-deep text-white hover:bg-bloom-light"
            >
              Svatby
            </CtaLink>
            <CtaLink
              href="/vence"
              variant="outline"
              className="border-white/50 text-white hover:border-white hover:bg-white/10"
            >
              Věnce
            </CtaLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <FadeIn>
          <h2 className="font-display text-4xl text-moss-deep sm:text-5xl md:text-6xl">
            Dva způsoby, jak začít
          </h2>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            <div className="border-t border-bloom/40 pt-6">
              <h3 className="font-display text-3xl text-moss-deep sm:text-4xl">
                Svatby & kytky
              </h3>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
                Větší zakázky, eventy a realizace na míru — napíšete poptávku a
                domluvíme se společně.
              </p>
              <CtaLink href="/kontakt" variant="ghost" className="mt-5 px-0">
                Poslat poptávku →
              </CtaLink>
            </div>
            <div className="border-t border-bloom/40 pt-6">
              <h3 className="font-display text-3xl text-moss-deep sm:text-4xl">
                Věnce
              </h3>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
                Hotové sezónní věnce — vyberete, přidáte do košíku a koupíte
                přímo na webu.
              </p>
              <CtaLink href="/vence" variant="ghost" className="mt-5 px-0">
                Do e-shopu →
              </CtaLink>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="bg-moss-deep text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <FadeIn>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-primary-foreground/55 sm:text-xs">
                  Realizace
                </p>
                <h2 className="mt-2 font-display text-4xl sm:text-5xl md:text-6xl">
                  Svatby
                </h2>
              </div>
              <CtaLink
                href="/svatby"
                className="border border-white/40 bg-transparent text-white hover:bg-white/10"
              >
                Celá galerie
              </CtaLink>
            </div>
          </FadeIn>
          <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {featuredWeddings.map((w, i) => (
              <FadeIn key={w.slug} delay={i * 100}>
                <Link href={`/svatby/${w.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={w.cover}
                      alt={w.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-2xl sm:text-3xl">{w.title}</h3>
                    <h4 className="text-[10px] font-normal tracking-[0.14em] uppercase text-primary-foreground/55 sm:text-xs">
                      {w.season}
                    </h4>
                  </div>
                  <p className="mt-1 text-sm text-primary-foreground/65 sm:text-base">
                    {w.place}
                  </p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <FadeIn>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1400&q=80"
                alt="Květinové aranžmá"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground sm:text-xs">
                Kytky & eventy
              </p>
              <h2 className="mt-2 font-display text-4xl text-moss-deep sm:text-5xl md:text-6xl">
                Květiny na míru
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:mt-5">
                Květiny do domu, do firmy, výzdoba eventů i individuální
                aranžmá. Každá zakázka vzniká podle vaší představy a konkrétní
                příležitosti, orientačně od 2&nbsp;000&nbsp;Kč. Stačí poslat
                poptávku a domluvíme se na všem ostatním.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CtaLink href="/kytky">Kytky</CtaLink>
                <CtaLink href="/kontakt?typ=event" variant="outline">
                  Eventy
                </CtaLink>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <FadeIn>
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
              <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1400&q=80"
                  alt="Sezónní věnec THE BLOOMS"
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground sm:text-xs">
                  E-shop
                </p>
                <h2 className="mt-2 font-display text-4xl text-moss-deep sm:text-5xl md:text-6xl">
                  Sezónní věnce
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                  Hotové věnce podle sezóny — s fotografií, cenou, rozměrem a
                  dostupností. Vyberete a koupíte přímo na webu.
                </p>
                <CtaLink href="/vence" className="mt-8">
                  Do e-shopu
                </CtaLink>
              </div>
            </div>
          </FadeIn>

          <div className="mt-12 grid gap-6 sm:mt-14 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {featuredWreaths.map((w, i) => (
              <FadeIn key={w.slug} delay={i * 80}>
                <Link href={`/vence/${w.slug}`} className="group block">
                  <div className="relative aspect-square overflow-hidden bg-stone">
                    <Image
                      src={w.image}
                      alt={w.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-2xl text-moss-deep sm:text-3xl">
                        {w.name}
                      </h3>
                      <h4 className="mt-1 text-[10px] font-normal tracking-[0.12em] uppercase text-muted-foreground sm:text-xs">
                        {w.season} · {w.size}
                      </h4>
                    </div>
                    <p className="text-base font-medium">{formatPrice(w.price)}</p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <FadeIn>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10">
            <div>
              <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground sm:text-xs">
                Workshopy
              </p>
              <h2 className="mt-2 font-display text-4xl text-moss-deep sm:text-5xl md:text-6xl">
                Přijedu za vámi
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:mt-5">
                Květinové a věncové workshopy domů, do firmy nebo na akci.
                Přivezu květiny, materiál i nástroje — vy zajistíte místo a lidi.
              </p>
              <CtaLink href="/workshopy" className="mt-8">
                Workshopy
              </CtaLink>
            </div>
            <div className="relative aspect-[5/4] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1400&q=80"
                alt="Floristický workshop"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 45vw"
              />
            </div>
          </div>
        </FadeIn>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FaqSection faqs={faqs} />
      </div>

      <section className="border-t border-bloom/30">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
          <FadeIn>
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1400&q=80"
                alt="Svatební květinová realizace"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
          </FadeIn>
          <FadeIn delay={80} className="lg:py-4">
            <h2 className="font-display text-4xl leading-[1.05] text-moss-deep text-balance sm:text-5xl md:text-6xl">
              „Jo, přesně tohle chci.“
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:mt-5">
              Podívejte se na realizace, nebo mi rovnou napište.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink href="/svatby" variant="outline">
                Realizace
              </CtaLink>
              <CtaLink href="/kontakt">Napsat</CtaLink>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
