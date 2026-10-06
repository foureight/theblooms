import type { Metadata } from "next";
import Image from "next/image";
import { CtaLink } from "@/components/cta-link";
import { FadeIn } from "@/components/fade-in";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/data/site";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  serviceJsonLd,
} from "@/lib/seo";

const pageDescription =
  "Květinové a věncové workshopy THE BLOOMS — přijedu domů, do firmy nebo na akci. Přivezu květiny, materiál i nástroje. Domluvte workshop s Alenou Šmejkalovou.";

export const metadata: Metadata = {
  title: "Květinové a věncové workshopy",
  description: pageDescription,
  keywords: [
    "květinový workshop",
    "věncový workshop",
    "floristický workshop",
    "team building květiny",
    "workshop doma",
    "THE BLOOMS",
  ],
  alternates: { canonical: "/workshopy" },
  openGraph: {
    title: `Workshopy · ${site.name}`,
    description: pageDescription,
    type: "website",
    locale: "cs_CZ",
  },
};

const faqs = [
  {
    question: "Kde workshop probíhá?",
    answer:
      "Přijedu za vámi — domů, do firmy, na soukromou akci nebo firemní event. Vy zajistíte místo a účastníky, já přivezu materiál i program.",
  },
  {
    question: "Co je v ceně workshopu?",
    answer:
      "Květiny a sezónní materiál, nástroje, vedení workshopu a tipy, jak o hotovou práci pečovat. Domluvíme počet lidí, téma a délku.",
  },
  {
    question: "Jaké formáty nabízíte?",
    answer:
      "Květinové workshopy (kytice a aranžmá), věncové workshopy a firemní / týmové workshopy jako team building nebo zážitek pro klienty.",
  },
  {
    question: "Jak workshop objednám?",
    answer:
      "Přes kontaktní formulář — napište počet lidí, termín, místo a jestli chcete kytice, věnce, nebo kombinaci. Domluvíme zbytek.",
  },
];

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Úvod", path: "/" },
    { name: "Workshopy", path: "/workshopy" },
  ]),
  serviceJsonLd({
    name: "Květinové a věncové workshopy",
    description: pageDescription,
    path: "/workshopy",
    serviceType: "Floristický workshop",
  }),
  faqJsonLd(faqs),
];

const formats = [
  {
    title: "Květinový workshop",
    text: "Společně skládáme kytice nebo aranžmá. Ukážu postup, výběr květin i jak s nimi pracovat, aby výsledek vydržel.",
  },
  {
    title: "Věncový workshop",
    text: "Sezónní věnce na dveře, stůl nebo jako dárek. Každý si odnese vlastní kousek — podle sezóny a materiálu, který přivezu.",
  },
  {
    title: "Firemní a týmové",
    text: "Team building nebo dárek pro klienty. Domluvíme téma, počet lidí i délku, aby to sedělo na vaši akci.",
  },
];

const included = [
  "Květiny a sezónní materiál",
  "Nástroje a pomocný inventář",
  "Vedení workshopu od začátku do konce",
  "Tipy, jak o hotovou práci pečovat",
];

const places = [
  {
    title: "Domů",
    text: "Soukromý workshop pro rodinu, kamarádky nebo oslavu.",
  },
  {
    title: "Do firmy",
    text: "Pro tým, partnery nebo firemní setkání — bez starostí s přípravou.",
  },
  {
    title: "Na akci",
    text: "Svatba, baby shower, narozeniny nebo jiná soukromá událost.",
  },
  {
    title: "Na event",
    text: "Větší firemní event, kde má floristika být zážitkem, ne jen dekorací.",
  },
];

export default function WorkshopyPage() {
  return (
    <div>
      <JsonLd data={jsonLd} />
      <div className="relative h-[45svh] min-h-[280px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1800&q=80"
          alt="Květinový workshop"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-moss-deep/40" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <h1 className="font-display text-6xl text-white sm:text-7xl">
            Workshopy
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Nemám stálou dílnu otevřenou veřejnosti — workshopy dělám na míru a
            přijedu za vámi. Vy zajistíte místo a lidi, já přivezu květiny,
            materiál, nástroje i celý program. Domluvíme se na tématu, počtu
            účastníků a termínu.
          </p>
          <CtaLink href="/kontakt?typ=workshop" className="mt-8">
            Domluvit workshop
          </CtaLink>
        </FadeIn>

        <FadeIn delay={80}>
          <section className="mt-20">
            <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
              Formáty
            </p>
            <h2 className="mt-2 font-display text-4xl text-moss-deep sm:text-5xl md:text-6xl">
              Co spolu tvoříme
            </h2>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {formats.map((item) => (
                <div key={item.title} className="border-t border-bloom/40 pt-5">
                  <h3 className="font-display text-xl text-moss-deep sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        <FadeIn delay={100}>
          <section className="mt-20 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1400&q=80"
                alt="Společná práce s květinami"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
                Co je v ceně
              </p>
              <h2 className="mt-2 font-display text-4xl text-moss-deep sm:text-5xl md:text-6xl">
                Přivezu vše potřebné
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                Nemusíte shánět květiny ani nůžky. Postarám se o materiál i o to,
                aby si každý odnesl hotovou práci, na kterou bude vzpomínat.
              </p>
              <ul className="mt-8 space-y-3">
                {included.map((item) => (
                  <li
                    key={item}
                    className="border-l-2 border-moss/40 pl-4 text-sm tracking-wide"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </FadeIn>

        <FadeIn delay={120}>
          <section className="mt-20 border-t border-border pt-12">
            <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
              Kde
            </p>
            <h2 className="mt-2 font-display text-4xl text-moss-deep sm:text-5xl md:text-6xl">
              Přijedu za vámi
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Workshop nemusí být u mě. Stačí stůl, světlo a prostor, kde se
              pohodlně vejdete.
            </p>
            <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {places.map((place) => (
                <li key={place.title} className="border-t border-bloom/40 pt-4">
                  <h3 className="font-display text-xl text-moss-deep sm:text-2xl">
                    {place.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {place.text}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </FadeIn>

        <FaqSection faqs={faqs} />

        <FadeIn delay={140}>
          <section className="mt-20 border-t border-bloom/30 pt-12">
            <h2 className="font-display text-4xl text-moss-deep text-balance sm:text-5xl md:text-6xl">
              Napište, pro koho workshop plánujete
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              Počet lidí, termín, místo a jestli chcete kytice, věnce, nebo něco
              mezi tím. Domluvíme zbytek společně.
            </p>
            <CtaLink href="/kontakt?typ=workshop" className="mt-8">
              Domluvit workshop
            </CtaLink>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
