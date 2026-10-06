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
    <div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                  : "border-transparent hover:border-bloom/40",
              )}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={variant.image}
                  alt={variant.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
                />
                <span
                  className={cn(
                    "absolute top-3 right-3 inline-flex size-8 items-center justify-center border transition-colors",
                    active
                      ? "border-bloom-light bg-bloom-light text-white"
                      : "border-white/70 bg-black/25 text-white",
                  )}
                >
                  {active ? <Check className="size-4" /> : null}
                </span>
              </div>
              <div className="border-t border-border/60 bg-background px-4 py-4">
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

      <div className="mt-10 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {selected.length === 0
            ? "Vyberte jednu nebo více variant."
            : `Vybráno: ${selectedNames.join(", ")}`}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/svatby#dekorace"
            className="inline-flex items-center justify-center px-7 py-3.5 text-xs font-medium tracking-[0.2em] uppercase text-moss-deep underline-offset-4 hover:text-bloom-light hover:underline"
          >
            Zpět na inventář
          </Link>
          <CtaLink href={contactHref} className={selected.length === 0 ? "opacity-60" : undefined}>
            {selected.length === 0 ? "Poptat svatbu" : "Poptat vybrané"}
          </CtaLink>
        </div>
      </div>
    </div>
  );
}
