import type { Metadata } from "next";
import { CtaLink } from "@/components/cta-link";
import { CmsImage } from "@/components/cms-image";
import { FadeIn } from "@/components/fade-in";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/data/site";
import {
  getCmsContent,
  mergeFlowerCards,
  slotFrom,
  textFrom,
} from "@/lib/cms/content";
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
    slot: "kytky.gallery1",
    image:
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1200&q=80",
  },
  {
    title: "Květiny do domu",
    text: "Aranžmá do bytu nebo domu: na stůl, komodu, vstupní prostor nebo jako dárek. Vždy podle vaší představy a sezóny.",
    slot: "kytky.gallery2",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80",
  },
  {
    title: "Květiny do firmy",
    text: "Pravidelná i jednorázová floristika pro kanceláře, recepci, meeting rooms nebo firemní prostory.",
    slot: "kytky.gallery3",
    image:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80",
  },
  {
    title: "Pravidelná floristika",
    text: "Opakované dodávky čerstvých květin. Domluvíme frekvenci, styl a rozpočet tak, aby to dávalo smysl dlouhodobě.",
    slot: "kytky.gallery4",
    image:
      "https://images.unsplash.com/photo-1455659817273-f96807741569?w=1200&q=80",
  },
  {
    title: "Speciální objednávky",
    text: "Narozeniny, výročí, poděkování, otevření provozu — každá zakázka vzniká na míru konkrétní příležitosti.",
    slot: "kytky.gallery5",
    image:
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=1200&q=80",
  },
  {
    title: "Výzdoba eventů",
    text: "Firemní akce, launch party, konference i soukromé události. Květiny i dekorace včetně vlastního inventáře.",
    slot: "kytky.gallery6",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
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

export const dynamic = "force-dynamic";

export default async function KytkyPage() {
  const cms = await getCmsContent();
  const hero = slotFrom(
    cms,
    "kytky.hero",
    "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1800&q=80",
  );
  const eventImg = slotFrom(
    cms,
    "kytky.eventy",
    "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80",
  );
  const builtInCards = services.map((s) => ({
    title: s.title,
    text: s.text,
    image: slotFrom(cms, s.slot, s.image),
  }));
  const customCards = mergeFlowerCards(cms).map((c) => ({
    title: c.title,
    text: c.text,
    image: c.image,
  }));
  const serviceCards = [...builtInCards, ...customCards];

  return (
    <div>
      <JsonLd data={jsonLd} />

      <div className="relative h-[45svh] min-h-[280px] overflow-hidden">
        <CmsImage
          src={hero}
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
            {textFrom(cms, "kytky.intro")}
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

        <FadeIn delay={60}>
          <section
            className="mt-16 sm:mt-20"
            aria-label="Ukázky uvážených květin"
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {builtInCards.map((item) => (
                <figure key={item.title} className="group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone">
                    <CmsImage
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width:640px) 50vw, 33vw"
                    />
                  </div>
                  <figcaption className="mt-3 font-display text-lg text-moss-deep sm:text-xl">
                    {item.title}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        </FadeIn>

        <FadeIn delay={80}>
          <section className="mt-16 sm:mt-20" aria-labelledby="kytky-sluzby">
            <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
              Služby
            </p>
            <h2
              id="kytky-sluzby"
              className="mt-2 font-display text-4xl text-moss-deep sm:text-5xl md:text-6xl"
            >
              Co můžu připravit
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Od květin do domu přes firemní floristiku až po výzdobu eventu —
              vždy na míru a podle konkrétní příležitosti.
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {serviceCards.map((item) => (
                <article
                  key={item.title}
                  className="border-t border-bloom/40 pt-5"
                >
                  <h3 className="font-display text-xl text-moss-deep sm:text-2xl">
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
              <CmsImage
                src={eventImg}
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
              <h2 className="mt-2 font-display text-4xl text-moss-deep sm:text-5xl md:text-6xl">
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

        <FaqSection faqs={faqs} />

        <FadeIn delay={120}>
          <section className="mt-16 border-t border-bloom/30 pt-12 sm:mt-20">
            <h2 className="font-display text-4xl text-moss-deep text-balance sm:text-5xl md:text-6xl">
              Napište, pro jakou příležitost květiny hledáte
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              Domů, do firmy, na event nebo jako speciální objednávku. Ozvu se a
              domluvíme zbytek.
            </p>
          </section>
        </FadeIn>

        <FadeIn delay={160}>
          <section
            className="mt-14 sm:mt-20"
            aria-labelledby="kytky-jak"
          >
            <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
              Postup
            </p>
            <h2
              id="kytky-jak"
              className="mt-2 font-display text-4xl text-moss-deep sm:text-5xl md:text-6xl"
            >
              Jak to probíhá
            </h2>
            <ol className="mt-10 grid gap-8 sm:grid-cols-3">
              <li className="border-t border-bloom/40 pt-5">
                <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground sm:text-xs">
                  01
                </p>
                <h3 className="mt-2 font-display text-xl text-moss-deep sm:text-2xl">
                  Napíšete poptávku
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Termín, příležitost, představa o stylu a orientační rozpočet.
                  Čím víc detailů, tím rychleji se domluvíme.
                </p>
              </li>
              <li className="border-t border-bloom/40 pt-5">
                <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground sm:text-xs">
                  02
                </p>
                <h3 className="mt-2 font-display text-xl text-moss-deep sm:text-2xl">
                  Domluvíme koncept
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Ozvu se s návrhem květin, rozsahu a ceny. U větších akcí
                  doladíme i inventář a instalaci.
                </p>
              </li>
              <li className="border-t border-bloom/40 pt-5">
                <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground sm:text-xs">
                  03
                </p>
                <h3 className="mt-2 font-display text-xl text-moss-deep sm:text-2xl">
                  Realizace
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Květiny připravím ve své dílně a podle domluvy předám,
                  doručím, nebo nainstaluji na místě.
                </p>
              </li>
            </ol>
            <div className="mt-10 sm:mt-12">
              <CtaLink href="/kontakt?typ=kytky">Poslat poptávku</CtaLink>
            </div>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
