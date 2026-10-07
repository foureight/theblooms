"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Wreath } from "@/data/wreaths";
import { CtaLink } from "@/components/cta-link";
import { CmsImage } from "@/components/cms-image";
import { FadeIn } from "@/components/fade-in";
import { WreathCardCaption } from "@/components/wreath-card-caption";
import {
  WreathSeasonFilters,
  type WreathSeasonFilter,
} from "@/components/wreath-season-filters";

type Props = {
  title: string;
  text: string;
  items: Wreath[];
  limit?: number;
};

export function HomeWreathsSection({
  title,
  text,
  items,
  limit = 6,
}: Props) {
  const [season, setSeason] = useState<WreathSeasonFilter>("Vše");

  const filtered = useMemo(() => {
    const list =
      season === "Vše" ? items : items.filter((w) => w.season === season);
    return list.slice(0, limit);
  }, [items, season, limit]);

  return (
    <section className="border-y border-border/60 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <FadeIn>
          <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground sm:text-xs">
            E-shop
          </p>
          <h2 className="mt-2 font-display text-4xl text-moss-deep sm:text-5xl md:text-6xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {text}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CtaLink href="/vence">Celý e-shop</CtaLink>
            <WreathSeasonFilters value={season} onChange={setSeason} />
          </div>
        </FadeIn>

        {filtered.length === 0 ? (
          <p className="mt-12 text-sm text-muted-foreground">
            V této sezóně zatím nic není. Podívejte se na{" "}
            <Link href="/vence" className="underline underline-offset-2">
              celý e-shop
            </Link>
            .
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:mt-14 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {filtered.map((w, i) => (
              <FadeIn key={w.slug} delay={i * 60}>
                <Link href={`/vence/${w.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone">
                    <CmsImage
                      src={w.image}
                      alt={w.name}
                      fill
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                    {!w.available ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-moss-deep/45">
                        <span className="bg-background px-3 py-1.5 text-[10px] tracking-[0.14em] uppercase text-foreground">
                          Momentálně nedostupné
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <WreathCardCaption wreath={w} priceClassName="text-base" />
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
