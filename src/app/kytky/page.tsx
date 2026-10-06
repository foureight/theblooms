import type { Metadata } from "next";
import Image from "next/image";
import { CtaLink } from "@/components/cta-link";
import { FadeIn } from "@/components/fade-in";

export const metadata: Metadata = {
  title: "Kytky",
  description:
    "Větší a individuální květinové zakázky od 2 000 Kč — aranžmá, květiny do domu i firmy, eventy.",
};

const items = [
  "Větší kytice a aranžmá",
  "Květiny do domu",
  "Květiny do firmy",
  "Pravidelná floristika",
  "Speciální objednávky",
  "Výzdoba eventů",
];

export default function KytkyPage() {
  return (
    <div>
      <div className="relative h-[45svh] min-h-[280px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1800&q=80"
          alt="Květinové aranžmá"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-moss-deep/40" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <h1 className="font-display text-6xl text-white sm:text-7xl">Kytky</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Nemám klasické květinářství a neberu běžné malé kytice. Zaměřuji se
            na větší a individuální zakázky — orientačně od{" "}
            <strong className="font-medium text-foreground">2&nbsp;000&nbsp;Kč</strong>.
            Objednání není přes e-shop; napište mi poptávku.
          </p>
        </FadeIn>

        <FadeIn delay={80}>
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li
                key={item}
                className="border-t border-moss/25 pt-4 text-sm tracking-wide"
              >
                {item}
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={120}>
          <section className="mt-20 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80"
                alt="Event dekorace"
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
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Květiny i celková dekorace prostoru — včetně vlastního inventáře.
                Firemní eventy a větší události řešíme společně přes poptávku.
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
      </div>
    </div>
  );
}
