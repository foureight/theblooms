import type { Metadata } from "next";
import Image from "next/image";
import { CtaLink } from "@/components/cta-link";
import { FadeIn } from "@/components/fade-in";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/data/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  floristOrganization,
} from "@/lib/seo";

const pageDescription = `Za floristickým studiem ${site.name} stojí ${site.owner}. Svatby, větší květinové zakázky, věnce, eventy a workshopy — osobně, v dílně, bez klasického květinářství.`;

export const metadata: Metadata = {
  title: `O mně — ${site.owner}`,
  description: pageDescription,
  keywords: [
    site.owner,
    "floristka",
    "floristické studio",
    "THE BLOOMS",
    "svatební floristika",
  ],
  alternates: { canonical: "/o-mne" },
  openGraph: {
    title: `${site.owner} · ${site.name}`,
    description: pageDescription,
    type: "profile",
    locale: "cs_CZ",
  },
};

const faqs = [
  {
    question: `Kdo stojí za ${site.name}?`,
    answer: `Za studiem ${site.name} stojí floristka ${site.owner}. Pracuje ve vlastní dílně — bez kamenné prodejny a bez klasického květinářství.`,
  },
  {
    question: "Čemu se studio věnuje?",
    answer:
      "Především svatbám, větším květinovým zakázkám, eventům, sezónním věncům a workshopům. Ráda skládá celý koncept: květiny, prostor, světlo a dekorace.",
  },
  {
    question: "Jaký je styl práce?",
    answer:
      "Spíš editorial a klidný než okázale květinový. Součástí nabídky je i vlastní inventář dekorací.",
  },
  {
    question: "Jak se domluvím na spolupráci?",
    answer:
      "Nejjednodušší je napsat přes kontaktní formulář. U svatby uveďte datum a místo, u kytek příležitost, u workshopu počet lidí a termín.",
  },
];

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Úvod", path: "/" },
    { name: "O mně", path: "/o-mne" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${site.owner} — ${site.name}`,
    url: absoluteUrl("/o-mne"),
    mainEntity: {
      "@type": "Person",
      name: site.owner,
      jobTitle: "Floristka",
      worksFor: floristOrganization(),
      url: absoluteUrl("/o-mne"),
      email: site.email,
      telephone: site.phone,
      sameAs: [site.instagram],
      description: pageDescription,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `O studiu ${site.name}`,
    url: absoluteUrl("/o-mne"),
    about: floristOrganization(),
    description: pageDescription,
  },
  faqJsonLd(faqs),
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={jsonLd} />
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <FadeIn>
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1591886960571-74d43ddc707f?w=1200&q=80"
              alt={`Floristka ${site.owner} — studio ${site.name}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 40vw"
            />
          </div>
        </FadeIn>
        <FadeIn delay={80}>
          <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
            Osobně
          </p>
          <h1 className="mt-3 font-name text-5xl font-bold tracking-wide text-foreground sm:text-6xl md:text-7xl">
            {site.owner}
          </h1>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              Za {site.name} stojím já — {site.owner}. Pracuji ve vlastní dílně
              — bez kamenné prodejny a bez klasického květinářství. Věnuji se
              především svatbám, větším květinovým zakázkám, eventům, věncům a
              workshopům.
            </p>
            <p>
              Ráda skládám celý koncept: květiny, prostor, světlo a dekorace.
              Mám vlastní inventář a styl, který je spíš editorial a klidný než
              „okázale květinový“.
            </p>
            <p>
              Květiny připravuji na objednávku a podle vaší představy. Hotové
              sezónní věnce najdete v e-shopu; zbytek domlouváme přes poptávku.
            </p>
          </div>
          <CtaLink href="/kontakt" className="mt-10">
            Napsat mi
          </CtaLink>
        </FadeIn>
      </div>

      <FaqSection faqs={faqs} />
    </div>
  );
}
