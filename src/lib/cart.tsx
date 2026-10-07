"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getWreath,
  getWreathSize,
  type Wreath,
  type WreathSizeId,
} from "@/data/wreaths";

export type CartProductSnapshot = {
  name: string;
  sizeLabel: string;
  price: number;
  image: string;
};

export type CartItem = {
  slug: string;
  sizeId: WreathSizeId;
  quantity: number;
  /** Snapshot from CMS-merged product at add time — admin data wins. */
  product?: CartProductSnapshot;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (
    slug: string,
    sizeId?: WreathSizeId,
    quantity?: number,
    product?: CartProductSnapshot,
  ) => void;
  removeItem: (slug: string, sizeId: WreathSizeId) => void;
  setQuantity: (slug: string, sizeId: WreathSizeId, quantity: number) => void;
  clear: () => void;
  count: number;
  total: number;
  hydrated: boolean;
  /** Live CMS catalog (admin overrides), when loaded. */
  catalog: Wreath[];
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "the-blooms-cart-v3";

function cartKey(slug: string, sizeId: WreathSizeId) {
  return `${slug}::${sizeId}`;
}

function normalizeItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const out: CartItem[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const item = row as Partial<CartItem> & { slug?: string };
    if (!item.slug || typeof item.slug !== "string") continue;
    const sizeId: WreathSizeId =
      item.sizeId === "s" || item.sizeId === "m" || item.sizeId === "l"
        ? item.sizeId
        : "m";
    const quantity =
      typeof item.quantity === "number" && item.quantity > 0
        ? Math.floor(item.quantity)
        : 1;
    const product =
      item.product &&
      typeof item.product.name === "string" &&
      typeof item.product.price === "number"
        ? {
            name: item.product.name,
            sizeLabel:
              typeof item.product.sizeLabel === "string"
                ? item.product.sizeLabel
                : "",
            price: item.product.price,
            image:
              typeof item.product.image === "string" ? item.product.image : "",
          }
        : undefined;
    out.push({ slug: item.slug, sizeId, quantity, product });
  }
  return out;
}

function resolveLine(
  item: CartItem,
  catalog: Wreath[],
): CartProductSnapshot | null {
  if (item.product) return item.product;
  const fromCms = catalog.find((w) => w.slug === item.slug);
  if (fromCms) {
    const size = getWreathSize(fromCms, item.sizeId);
    return {
      name: fromCms.name,
      sizeLabel: size.label,
      price: size.price,
      image: fromCms.image,
    };
  }
  const fallback = getWreath(item.slug);
  if (!fallback) return null;
  const size = getWreathSize(fallback, item.sizeId);
  return {
    name: fallback.name,
    sizeLabel: size.label,
    price: size.price,
    image: fallback.image,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [catalog, setCatalog] = useState<Wreath[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(normalizeItems(JSON.parse(raw)));
      } else {
        const legacy =
          localStorage.getItem("the-blooms-cart-v2") ||
          localStorage.getItem("the-blooms-cart");
        if (legacy) setItems(normalizeItems(JSON.parse(legacy)));
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/wreaths", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { wreaths?: Wreath[] };
        if (!cancelled && Array.isArray(data.wreaths)) {
          setCatalog(data.wreaths);
        }
      } catch {
        /* ignore — fall back to snapshots / code defaults */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback(
    (
      slug: string,
      sizeId: WreathSizeId = "m",
      quantity = 1,
      product?: CartProductSnapshot,
    ) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.slug === slug && i.sizeId === sizeId,
        );
        if (existing) {
          return prev.map((i) =>
            i.slug === slug && i.sizeId === sizeId
              ? {
                  ...i,
                  quantity: i.quantity + quantity,
                  product: product ?? i.product,
                }
              : i,
          );
        }
        return [...prev, { slug, sizeId, quantity, product }];
      });
    },
    [],
  );

  const removeItem = useCallback((slug: string, sizeId: WreathSizeId) => {
    setItems((prev) =>
      prev.filter((i) => !(i.slug === slug && i.sizeId === sizeId)),
    );
  }, []);

  const setQuantity = useCallback(
    (slug: string, sizeId: WreathSizeId, quantity: number) => {
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter((i) => !(i.slug === slug && i.sizeId === sizeId)),
        );
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.slug === slug && i.sizeId === sizeId ? { ...i, quantity } : i,
        ),
      );
    },
    [],
  );

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const total = useMemo(
    () =>
      items.reduce((sum, i) => {
        const line = resolveLine(i, catalog);
        return sum + (line?.price ?? 0) * i.quantity;
      }, 0),
    [items, catalog],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQuantity,
      clear,
      count,
      total,
      hydrated,
      catalog,
    }),
    [
      items,
      addItem,
      removeItem,
      setQuantity,
      clear,
      count,
      total,
      hydrated,
      catalog,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { cartKey, resolveLine };
