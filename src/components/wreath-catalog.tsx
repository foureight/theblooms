"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice, type Wreath } from "@/data/wreaths";
import { Badge } from "@/components/ui/badge";
import { CmsImage } from "@/components/cms-image";
import { cn } from "@/lib/utils";

const seasons = ["Vše", "Jaro", "Léto", "Podzim", "Advent"] as const;

const seasonActive: Record<(typeof seasons)[number], string> = {
  Vše: "bg-moss-deep text-primary-foreground",
  Jaro: "bg-bloom-yellow text-foreground",
  Léto: "bg-bloom text-white",
  Podzim: "bg-bloom-orange text-white",
  Advent: "bg-bloom-pink text-white",
};

export function WreathCatalog({ items }: { items: Wreath[] }) {
  const [season, setSeason] = useState<(typeof seasons)[number]>("Vše");

  const filtered = useMemo(() => {
    if (season === "Vše") return items;
    return items.filter((w) => w.season === season);
  }, [season, items]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {seasons.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSeason(s)}
            className={cn(
              "px-4 py-2 text-xs tracking-[0.16em] uppercase transition-colors",
              season === s
                ? seasonActive[s]
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-sm text-muted-foreground">
          V této sezóně zatím nic není. Podívejte se na ostatní věnce, nebo
          napište poptávku.
        </p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((w) => (
            <Link key={w.slug} href={`/vence/${w.slug}`} className="group block">
              <div className="relative aspect-square overflow-hidden bg-stone">
                <CmsImage
                  src={w.image}
                  alt={w.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                {!w.available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-moss-deep/45">
                    <Badge variant="secondary">Momentálně nedostupné</Badge>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl text-moss-deep sm:text-3xl">
                    {w.name}
                  </h3>
                  <h4 className="mt-1 text-[10px] font-normal tracking-[0.12em] uppercase text-muted-foreground sm:text-xs">
                    {w.season} · {w.size}
                  </h4>
                </div>
                <p className="text-sm font-medium">{formatPrice(w.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
