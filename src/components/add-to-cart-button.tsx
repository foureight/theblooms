"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import {
  formatPrice,
  getWreathSizes,
  type Wreath,
  type WreathSizeId,
} from "@/data/wreaths";
import { cn } from "@/lib/utils";

export function AddToCartButton({ wreath }: { wreath: Wreath }) {
  const { addItem } = useCart();
  const sizes = useMemo(() => getWreathSizes(wreath), [wreath]);
  const [sizeId, setSizeId] = useState<WreathSizeId>(
    sizes.find((s) => s.id === "m")?.id ?? sizes[0]?.id ?? "m",
  );
  const [added, setAdded] = useState(false);
  const selected = sizes.find((s) => s.id === sizeId) ?? sizes[0]!;

  if (!wreath.available) {
    return (
      <Button disabled className="w-full sm:w-auto">
        Momentálně nedostupné
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] tracking-[0.16em] uppercase text-muted-foreground sm:text-xs">
          Velikost
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSizeId(s.id)}
              className={cn(
                "min-w-[6.5rem] border px-3 py-2.5 text-left transition-colors",
                sizeId === s.id
                  ? "border-moss-deep bg-moss-deep text-white"
                  : "border-border bg-background text-moss-deep hover:border-moss-deep",
              )}
            >
              <span className="block text-[10px] tracking-[0.14em] uppercase">
                {s.label}
              </span>
              <span className="mt-0.5 block text-sm font-medium">
                {formatPrice(s.price)}
              </span>
            </button>
          ))}
        </div>
      </div>
      <p className="text-2xl font-medium">{formatPrice(selected.price)}</p>
      <Button
        className="w-full sm:w-auto"
        onClick={() => {
          addItem(wreath.slug, sizeId);
          setAdded(true);
          setTimeout(() => setAdded(false), 1800);
        }}
      >
        {added ? "Přidáno do košíku" : "Přidat do košíku"}
      </Button>
    </div>
  );
}
