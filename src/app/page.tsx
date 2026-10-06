import Image from "next/image";
import Link from "next/link";
import { BloomWordmarkLive } from "@/components/bloom-logo";
import { CtaLink } from "@/components/cta-link";
import { FadeIn } from "@/components/fade-in";
import { weddings } from "@/data/weddings";
import { wreaths, formatPrice } from "@/data/wreaths";

export default function HomePage() {
  const featuredWeddings = weddings.slice(0, 3);
  const featuredWreaths = wreaths.filter((w) => w.available).slice(0, 3);

  return (
    <>
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
          <div className="reveal">
            <BloomWordmarkLive
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
              tone="dark"
            />
          </div>
          <h1 className="reveal reveal-delay-1 mt-6 max-w-2xl font-sans text-lg font-normal tracking-wide text-white/90 sm:text-xl">
            Floristické studio pro svatby, větší květinové realizace a věnce
          </h1>
          <p className="reveal reveal-delay-2 mt-3 max-w-lg text-base leading-relaxed text-white/70">
            Nejsem klasické květinářství — osobní práce v dílně, od celého
            svatebního konceptu po sezónní věnce.
          </p>
          <div className="reveal reveal-delay-3 mt-8 flex flex-wrap gap-3">
            <CtaLink
              href="/svatby"
              className="bg-bloom text-white hover:bg-bloom-deep"
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

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
            Dva způsoby, jak začít
          </p>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            <div className="border-t border-bloom/40 pt-6">
              <h2 className="font-display text-5xl text-moss-deep sm:text-6xl">
                Svatby & kytky
              </h2>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
                Větší zakázky, eventy a realizace na míru — napíšete poptávku a
                domluvíme se společně.
              </p>
              <CtaLink href="/kontakt" variant="ghost" className="mt-5 px-0">
                Poslat poptávku →
              </CtaLink>
            </div>
            <div className="border-t border-bloom/40 pt-6">
              <h2 className="font-display text-5xl text-moss-deep sm:text-6xl">
                Věnce
              </h2>
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
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.22em] uppercase text-primary-foreground/55">
                  Realizace
                </p>
                <h2 className="mt-2 font-display text-5xl sm:text-6xl">
                  Svatby
                </h2>
              </div>
              <CtaLink
                href="/svatby"
                className="bg-transparent border border-white/40 text-white hover:bg-white/10"
              >
                Celá galerie
              </CtaLink>
            </div>
          </FadeIn>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    <h3 className="font-display text-3xl">{w.title}</h3>
                    <span className="text-xs tracking-[0.14em] uppercase text-primary-foreground/55">
                      {w.season}
                    </span>
                  </div>
                  <p className="mt-1 text-base text-primary-foreground/65">
                    {w.place}
                  </p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid items-center gap-10 lg:grid-cols-2">
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
              <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
                Kytky & eventy
              </p>
              <h2 className="mt-3 font-display text-6xl text-moss-deep sm:text-7xl">
                Větší zakázky, ne malé kytice
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                Květiny do domu, do firmy, výzdoba eventů a individuální
                aranžmá — orientačně od 2&nbsp;000&nbsp;Kč. Objednání probíhá
                přes poptávku.
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
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
                  E-shop
                </p>
                <h2 className="mt-2 font-display text-5xl text-moss-deep sm:text-6xl">
                  Sezónní věnce
                </h2>
              </div>
              <CtaLink href="/vence" variant="outline">
                Všechny věnce
              </CtaLink>
            </div>
          </FadeIn>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                      <h3 className="font-display text-2xl text-moss-deep">
                        {w.name}
                      </h3>
                      <p className="mt-1 text-sm tracking-[0.12em] uppercase text-muted-foreground">
                        {w.season} · {w.size}
                      </p>
                    </div>
                    <p className="text-base font-medium">{formatPrice(w.price)}</p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
                Workshopy
              </p>
              <h2 className="mt-3 font-display text-6xl text-moss-deep sm:text-7xl">
                Přijedu za vámi
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Květinové a věncové workshopy domů, do firmy nebo na soukromou
                akci. Přivezu květiny, materiál i nástroje — vy zajistíte místo.
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

      <section className="mx-auto max-w-3xl px-4 pb-24 text-center sm:px-6">
        <FadeIn>
          <p className="font-display text-5xl text-moss-deep sm:text-6xl text-balance">
            „Jo, přesně tohle chci.“
          </p>
          <p className="mt-4 text-base text-muted-foreground">
            Podívejte se na realizace, nebo mi rovnou napište.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CtaLink href="/o-mne" variant="outline">
              O mně
            </CtaLink>
            <CtaLink href="/kontakt">Kontakt</CtaLink>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
