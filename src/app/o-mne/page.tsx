import type { Metadata } from "next";
import Image from "next/image";
import { CtaLink } from "@/components/cta-link";
import { FadeIn } from "@/components/fade-in";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "O mně",
  description: `Za ${site.name} stojím já — floristické studio pro svatby, věnce a větší zakázky.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <FadeIn>
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1591886960571-74d43ddc707f?w=1200&q=80"
              alt="Floristka THE BLOOMS"
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
          <h1 className="mt-3 font-name text-5xl font-medium tracking-wide text-foreground sm:text-6xl md:text-7xl">
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
            <p className="italic text-foreground/80">
              Text o vztahu ke květinám a způsobu práce doplníme později.
            </p>
          </div>
          <CtaLink href="/kontakt" className="mt-10">
            Napsat mi
          </CtaLink>
        </FadeIn>
      </div>
    </div>
  );
}
