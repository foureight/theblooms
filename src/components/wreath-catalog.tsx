"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Wreath } from "@/data/wreaths";
import { Badge } from "@/components/ui/badge";
import { CmsImage } from "@/components/cms-image";
import { WreathCardCaption } from "@/components/wreath-card-caption";
import {
  WreathSeasonFilters,
  type WreathSeasonFilter,
} from "@/components/wreath-season-filters";

type Props = {
  items: Wreath[];
  /** Pre-select / lock a season (e.g. Advent landing). */
  initialSeason?: WreathSeasonFilter;
  /** Hide season chips when the page is already season-specific. */
  hideFilters?: boolean;
};

export function WreathCatalog({
  items,
  initialSeason = "Vše",
  hideFilters = false,
}: Props) {
  const [season, setSeason] = useState<WreathSeasonFilter>(initialSeason);

  const filtered = useMemo(() => {
    const list =
      season === "Vše" ? items : items.filter((w) => w.season === season);
    return [...list].sort((a, b) => Number(b.available) - Number(a.available));
  }, [season, items]);

  return (
    <div>
      {!hideFilters ? (
        <WreathSeasonFilters value={season} onChange={setSeason} />
      ) : null}

      {filtered.length === 0 ? (
        <p className="mt-12 text-sm text-muted-foreground">
          V této sezóně zatím nic není. Podívejte se na ostatní věnce, nebo
          napište poptávku.
        </p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((w) => (
            <Link key={w.slug} href={`/vence/${w.slug}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-stone">
                <CmsImage
                  src={w.image}
                  alt={w.name}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                {!w.available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-moss-deep/45">
                    <Badge variant="secondary">Momentálně nedostupné</Badge>
                  </div>
                )}
              </div>
              <WreathCardCaption wreath={w} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
