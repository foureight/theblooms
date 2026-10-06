"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import type { Wreath } from "@/data/wreaths";

export function AddToCartButton({ wreath }: { wreath: Wreath }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!wreath.available) {
    return (
      <Button disabled className="w-full sm:w-auto">
        Momentálně nedostupné
      </Button>
    );
  }

  return (
    <Button
      className="w-full sm:w-auto"
      onClick={() => {
        addItem(wreath.slug);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
      }}
    >
      {added ? "Přidáno do košíku" : "Přidat do košíku"}
    </Button>
  );
}
