"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice, wreaths } from "@/data/wreaths";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const seasons = ["Vše", "Jaro", "Léto", "Podzim", "Advent"] as const;

export function WreathCatalog() {
  const [season, setSeason] = useState<(typeof seasons)[number]>("Vše");

  const filtered = useMemo(() => {
    if (season === "Vše") return wreaths;
    return wreaths.filter((w) => w.season === season);
  }, [season]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {seasons.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSeason(s)}
            className={cn(
              "px-4 py-2 text-[11px] tracking-[0.16em] uppercase transition-colors",
              season === s
                ? "bg-moss-deep text-primary-foreground"
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
                <Image
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
                  <h2 className="font-display text-xl text-moss-deep">
                    {w.name}
                  </h2>
                  <p className="mt-1 text-xs tracking-[0.12em] uppercase text-muted-foreground">
                    {w.season} · {w.size}
                  </p>
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
