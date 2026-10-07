"use client";

import { cn } from "@/lib/utils";

export const WREATH_SEASON_FILTERS = ["Vše", "Jaro", "Podzim", "Advent"] as const;
export type WreathSeasonFilter = (typeof WREATH_SEASON_FILTERS)[number];

const seasonActive: Record<WreathSeasonFilter, string> = {
  Vše: "bg-moss-deep text-primary-foreground",
  Jaro: "bg-bloom-yellow text-foreground",
  Podzim: "bg-bloom-orange text-white",
  Advent: "bg-bloom-pink text-white",
};

type Props = {
  value: WreathSeasonFilter;
  onChange: (value: WreathSeasonFilter) => void;
  className?: string;
};

export function WreathSeasonFilters({ value, onChange, className }: Props) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {WREATH_SEASON_FILTERS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={cn(
            "px-4 py-2 text-xs tracking-[0.16em] uppercase transition-colors",
            value === s
              ? seasonActive[s]
              : "bg-muted text-muted-foreground hover:text-foreground",
          )}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
