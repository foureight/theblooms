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

const pageTitle = "Kytky na míru — květiny do domu, firmy i na event";
const pageDescription =
  "Floristické studio THE BLOOMS: větší a individuální květinové zakázky od 2 000 Kč. Květiny do domu, do firmy, aranžmá a výzdoba eventů — vždy na objednávku přes poptávku.";

export const metadata: Metadata = {
  title: "Kytky na míru",
  description: pageDescription,
  keywords: [
    "kytky na míru",
    "květiny do domu",
    "květiny do firmy",
    "floristické studio",
    "výzdoba eventu",
    "květinové aranžmá",
    "THE BLOOMS",
    "Alena Šmejkalová",
  ],
  alternates: {
    canonical: "/kytky",
  },
  openGraph: {
    title: `${pageTitle} · ${site.name}`,
    description: pageDescription,
    type: "website",
    locale: "cs_CZ",
  },
};

const services = [
  {
    title: "Větší kytice a aranžmá",
    text: "Individuální květinové práce podle příležitosti — ne klasické malé kytice z květinářství, ale větší a promyšlené realizace.",
  },
  {
    title: "Květiny do domu",
    text: "Aranžmá do bytu nebo domu: na stůl, komodu, vstupní prostor nebo jako dárek. Vždy podle vaší představy a sezóny.",
  },
  {
    title: "Květiny do firmy",
    text: "Pravidelná i jednorázová floristika pro kanceláře, recepci, meeting rooms nebo firemní prostory.",
  },
  {
    title: "Pravidelná floristika",
    text: "Opakované dodávky čerstvých květin. Domluvíme frekvenci, styl a rozpočet tak, aby to dávalo smysl dlouhodobě.",
  },
  {
    title: "Speciální objednávky",
    text: "Narozeniny, výročí, poděkování, otevření provozu — každá zakázka vzniká na míru konkrétní příležitosti.",
  },
  {
    title: "Výzdoba eventů",
    text: "Firemní akce, launch party, konference i soukromé události. Květiny i dekorace včetně vlastního inventáře.",
  },
];

const faqs = [
  {
    question: "Je THE BLOOMS klasické květinářství?",
    answer:
      "Ne. THE BLOOMS je floristické studio Aleny Šmejkalové. Květiny tvoří vždy na objednávku a podle představy klienta — bez kamenné prodejny a bez běžných malých kytic z výlohy.",
  },
  {
    question: "Od jaké částky se květinové zakázky pohybují?",
    answer:
      "Orientačně od 2 000 Kč. Finální cena závisí na rozsahu, sezóně, květinách a tom, jestli jde o aranžmá, pravidelnou floristiku, nebo výzdobu eventu.",
  },
  {
    question: "Jak si objednám kytky?",
    answer:
      "Objednání neprobíhá přes e-shop. Stačí poslat poptávku přes kontaktní formulář — napište příležitost, termín a představu. Domluvíme detaily a cenu společně.",
  },
  {
    question: "Děláte i výzdobu firemních eventů?",
    answer:
      "Ano. Připravuji květiny i celkovou dekoraci prostoru, případně včetně vlastního inventáře (vázy, svícny, textil a další).",
  },
];

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Úvod", path: "/" },
    { name: "Kytky", path: "/kytky" },
  ]),
  serviceJsonLd({
    name: "Kytky na míru",
    description: pageDescription,
    path: "/kytky",
    serviceType: "Floristická zakázka",
    minPrice: "2000",
  }),
  faqJsonLd(faqs),
];

export default function KytkyPage() {
  return (
    <div>
      <JsonLd data={jsonLd} />

      <div className="relative h-[45svh] min-h-[280px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1800&q=80"
          alt="Květinové aranžmá na míru od floristického studia THE BLOOMS"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-moss-deep/40" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <h1 className="font-display text-6xl text-white sm:text-7xl">
            Kytky na míru
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Nemám klasické květinářství, květiny tvořím vždy na objednávku a
            podle vaší představy. Věnuji se větším a individuálním zakázkám,
            orientačně od{" "}
            <strong className="font-medium text-foreground">
              2&nbsp;000&nbsp;Kč
            </strong>
            . Stačí mi napsat, pro jakou příležitost květiny hledáte, a společně
            něco vymyslíme.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Za studiem {site.name} stojí floristka {site.owner}. Pracuji ve
            vlastní dílně — bez výlohy a bez e-shopu na kytky. Každá zakázka je
            poptávka: domluvíme styl, termín, rozpočet a doručení nebo instalaci.
          </p>
          <CtaLink href="/kontakt?typ=kytky" className="mt-8">
            Poslat poptávku
          </CtaLink>
        </FadeIn>

        <FadeIn delay={80}>
          <section className="mt-20" aria-labelledby="kytky-sluzby">
            <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
              Služby
            </p>
            <h2
              id="kytky-sluzby"
              className="mt-2 font-display text-5xl text-moss-deep"
            >
              Co můžu připravit
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Od květin do domu přes firemní floristiku až po výzdobu eventu —
              vždy na míru a podle konkrétní příležitosti.
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((item) => (
                <article
                  key={item.title}
                  className="border-t border-bloom/40 pt-5"
                >
                  <h3 className="text-base font-medium tracking-wide text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </FadeIn>

        <FadeIn delay={100}>
          <section className="mt-20 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80"
                alt="Výzdoba firemního eventu květinami THE BLOOMS"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
                Eventy
              </p>
              <h2 className="mt-2 font-display text-5xl text-moss-deep">
                Výzdoba firemních akcí
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Květiny i celková dekorace prostoru — včetně vlastního inventáře.
                Firemní eventy, launch party a větší události řešíme společně
                přes poptávku: od krátkého briefu po instalaci na místě.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CtaLink href="/kontakt?typ=kytky">Poptat kytky</CtaLink>
                <CtaLink href="/kontakt?typ=event" variant="outline">
                  Poptat event
                </CtaLink>
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn delay={120}>
          <section className="mt-20 border-t border-border pt-12" aria-labelledby="kytky-jak">
            <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
              Postup
            </p>
            <h2
              id="kytky-jak"
              className="mt-2 font-display text-5xl text-moss-deep"
            >
              Jak to probíhá
            </h2>
            <ol className="mt-10 grid gap-8 sm:grid-cols-3">
              <li className="border-t border-bloom/40 pt-5">
                <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
                  01
                </p>
                <h3 className="mt-2 text-base font-medium tracking-wide">
                  Napíšete poptávku
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Termín, příležitost, představa o stylu a orientační rozpočet.
                  Čím víc detailů, tím rychleji se domluvíme.
                </p>
              </li>
              <li className="border-t border-bloom/40 pt-5">
                <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
                  02
                </p>
                <h3 className="mt-2 text-base font-medium tracking-wide">
                  Domluvíme koncept
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Ozvu se s návrhem květin, rozsahu a ceny. U větších akcí
                  doladíme i inventář a instalaci.
                </p>
              </li>
              <li className="border-t border-bloom/40 pt-5">
                <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
                  03
                </p>
                <h3 className="mt-2 text-base font-medium tracking-wide">
                  Realizace
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Květiny připravím ve své dílně a podle domluvy předám,
                  doručím, nebo nainstaluji na místě.
                </p>
              </li>
            </ol>
          </section>
        </FadeIn>

        <FaqSection faqs={faqs} />

        <FadeIn delay={160}>
          <section className="mt-20 border-t border-bloom/30 pt-12">
            <p className="font-display text-4xl text-moss-deep sm:text-5xl text-balance">
              Napište, pro jakou příležitost květiny hledáte
            </p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              Domů, do firmy, na event nebo jako speciální objednávku. Ozvu se a
              domluvíme zbytek.
            </p>
            <CtaLink href="/kontakt?typ=kytky" className="mt-8">
              Poslat poptávku
            </CtaLink>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
