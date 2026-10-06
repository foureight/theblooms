"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import type { DecorationCategory } from "@/data/weddings";
import { cn } from "@/lib/utils";
import { CtaLink } from "@/components/cta-link";

type Props = {
  category: DecorationCategory;
};

export function DecorationVariantPicker({ category }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(slug: string) {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  const selectedNames = useMemo(
    () =>
      category.variants
        .filter((v) => selected.includes(v.slug))
        .map((v) => v.name),
    [category.variants, selected],
  );

  const contactHref =
    selectedNames.length > 0
      ? `/kontakt?typ=svatba&dekorace=${encodeURIComponent(
          `${category.title}: ${selectedNames.join(", ")}`,
        )}`
      : "/kontakt?typ=svatba";

  return (
    <div className="pb-24 sm:pb-0">
      <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {category.variants.map((variant) => {
          const active = selected.includes(variant.slug);
          return (
            <button
              key={variant.slug}
              type="button"
              onClick={() => toggle(variant.slug)}
              aria-pressed={active}
              className={cn(
                "group relative overflow-hidden border text-left transition-colors",
                active
                  ? "border-bloom-light ring-2 ring-bloom-light/40"
                  : "border-border/60 hover:border-bloom/40",
              )}
            >
              <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]">
                <Image
                  src={variant.image}
                  alt={variant.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width:420px) 100vw, (max-width:1024px) 50vw, 33vw"
                />
                <span
                  className={cn(
                    "absolute top-3 right-3 inline-flex size-9 items-center justify-center border transition-colors sm:size-8",
                    active
                      ? "border-bloom-light bg-bloom-light text-white"
                      : "border-white/70 bg-black/25 text-white",
                  )}
                >
                  {active ? <Check className="size-4" /> : null}
                </span>
              </div>
              <div className="border-t border-border/60 bg-background px-3 py-3 sm:px-4 sm:py-4">
                <p className="text-sm font-medium tracking-wide text-foreground">
                  {variant.name}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {variant.note}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Desktop / tablet actions */}
      <div className="mt-10 hidden border-t border-border pt-8 sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="min-w-0 flex-1 text-sm text-muted-foreground">
          {selected.length === 0
            ? "Vyberte jednu nebo více variant."
            : `Vybráno: ${selectedNames.join(", ")}`}
        </p>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            href="/svatby#dekorace"
            className="inline-flex items-center justify-center px-7 py-3.5 text-xs font-medium tracking-[0.2em] uppercase text-moss-deep underline-offset-4 hover:text-bloom-light hover:underline"
          >
            Zpět na inventář
          </Link>
          <CtaLink href={contactHref}>
            {selected.length === 0 ? "Poptat svatbu" : "Poptat vybrané"}
          </CtaLink>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 px-4 py-3 backdrop-blur-md sm:hidden">
        <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">
          {selected.length === 0
            ? "Vyberte varianty"
            : `Vybráno (${selected.length}): ${selectedNames.join(", ")}`}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/svatby#dekorace"
            className="inline-flex items-center justify-center border border-moss-deep/30 px-3 py-3 text-[10px] font-medium tracking-[0.16em] uppercase text-moss-deep"
          >
            Zpět
          </Link>
          <CtaLink
            href={contactHref}
            className="w-full px-3 py-3 text-center text-[10px] tracking-[0.16em]"
          >
            {selected.length === 0 ? "Poptat" : "Poptat vybrané"}
          </CtaLink>
        </div>
      </div>
    </div>
  );
}
