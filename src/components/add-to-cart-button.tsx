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

export function AddToCartButton({ wreath }: { wreath: Wreath }) {
  const { addItem } = useCart();
  const sizes = useMemo(() => getWreathSizes(wreath), [wreath]);
  const [sizeId, setSizeId] = useState<WreathSizeId>(
    sizes.find((s) => s.id === "m")?.id ?? sizes[0]?.id ?? "m",
  );
  const [added, setAdded] = useState(false);
  const selected = sizes.find((s) => s.id === sizeId) ?? sizes[0];

  if (!wreath.available) {
    return (
      <Button disabled className="w-full sm:w-auto">
        Momentálně nedostupné
      </Button>
    );
  }

  if (!selected) {
    return (
      <Button disabled className="w-full sm:w-auto">
        Velikost není nastavena
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      {sizes.length > 1 ? (
        <label className="block max-w-sm">
          <span className="text-[10px] tracking-[0.16em] uppercase text-muted-foreground sm:text-xs">
            Velikost
          </span>
          <select
            value={sizeId}
            onChange={(e) => setSizeId(e.target.value as WreathSizeId)}
            className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-bloom"
          >
            {sizes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} — {formatPrice(s.price)}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="text-sm text-muted-foreground">{selected.label}</p>
      )}
      <p className="text-2xl font-medium">{formatPrice(selected.price)}</p>
      <Button
        className="w-full sm:w-auto"
        onClick={() => {
          addItem(wreath.slug, selected.id);
          setAdded(true);
          setTimeout(() => setAdded(false), 1800);
        }}
      >
        {added ? "Přidáno do košíku" : "Přidat do košíku"}
      </Button>
    </div>
  );
}
