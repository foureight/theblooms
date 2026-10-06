import type { Metadata } from "next";
import Image from "next/image";
import { CtaLink } from "@/components/cta-link";
import { FadeIn } from "@/components/fade-in";

export const metadata: Metadata = {
  title: "Workshopy",
  description:
    "Květinové a věncové workshopy — přijedu domů, do firmy nebo na akci. Přivezu vše potřebné.",
};

const places = ["domů", "do firmy", "na soukromou akci", "na firemní event"];

export default function WorkshopyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <FadeIn>
          <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
            Společně tvořit
          </p>
          <h1 className="mt-3 font-display text-6xl text-moss-deep sm:text-7xl">
            Workshopy
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Květinové a věncové workshopy. Nemusí se konat u mě — přijedu přímo
            za vámi. Přivezu květiny, materiál, nástroje i vybavení. Vy
            zajistíte místo, o zbytek se postarám já.
          </p>
          <CtaLink href="/kontakt?typ=workshop" className="mt-8">
            Domluvit workshop
          </CtaLink>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1400&q=80"
              alt="Květinový workshop"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
        </FadeIn>
      </div>

      <FadeIn>
        <section className="mt-20 border-t border-border pt-12">
          <h2 className="font-display text-4xl text-moss-deep">Kde</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {places.map((place) => (
              <li
                key={place}
                className="border-l-2 border-moss/40 pl-4 text-sm tracking-wide capitalize"
              >
                {place}
              </li>
            ))}
          </ul>
        </section>
      </FadeIn>
    </div>
  );
}
