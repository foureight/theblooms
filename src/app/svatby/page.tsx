import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { DecorationCarousel } from "@/components/decoration-carousel";
import { FadeIn } from "@/components/fade-in";
import { decorations, weddings } from "@/data/weddings";

export const metadata: Metadata = {
  title: "Svatby",
  description:
    "Celý floristický a dekorační koncept svatby — kytice, obřad, hostina, instalace a vlastní inventář dekorací.",
};

export default function SvatbyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <FadeIn>
        <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
          Hlavní činnost
        </p>
        <h1 className="mt-3 font-display text-6xl text-moss-deep sm:text-7xl">
          Svatby
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-lg">
          Navrhnu celý floristický a dekorační koncept — nebo vyjdu z vaší
          představy a zrealizuji ji. Nejen květiny: brány, stoly, instalace,
          vázy, svícny, textil a další dekorace z vlastního inventáře.
        </p>
        <CtaLink href="/kontakt?typ=svatba" className="mt-8">
          Poptat svatbu
        </CtaLink>
      </FadeIn>

      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        {weddings.map((w, i) => (
          <FadeIn key={w.slug} delay={(i % 2) * 80}>
            <Link href={`/svatby/${w.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={w.cover}
                  alt={w.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h2 className="font-display text-4xl text-moss-deep">
                  {w.title}
                </h2>
                <span className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                  {w.season}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{w.place}</p>
            </Link>
          </FadeIn>
        ))}
      </div>

      <section className="mt-24">
        <FadeIn>
          <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
            Inventář
          </p>
          <h2 className="mt-2 font-display text-5xl text-moss-deep">
            Dekorace
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Vlastní inventář, který můžu nabídnout v rámci svatby: vázy, svícny,
            svíčky, nádoby, brány, textil a další.
          </p>
        </FadeIn>
        <div className="mt-10">
          <DecorationCarousel items={decorations} />
        </div>
      </section>
    </div>
  );
}
