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
  type WreathSizeId,
} from "@/data/wreaths";

export type CartItem = {
  slug: string;
  sizeId: WreathSizeId;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (slug: string, sizeId?: WreathSizeId, quantity?: number) => void;
  removeItem: (slug: string, sizeId: WreathSizeId) => void;
  setQuantity: (slug: string, sizeId: WreathSizeId, quantity: number) => void;
  clear: () => void;
  count: number;
  total: number;
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "the-blooms-cart-v2";

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
    out.push({ slug: item.slug, sizeId, quantity });
  }
  return out;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(normalizeItems(JSON.parse(raw)));
      } else {
        // migrate legacy cart (slug + qty only → medium size)
        const legacy = localStorage.getItem("the-blooms-cart");
        if (legacy) {
          setItems(normalizeItems(JSON.parse(legacy)));
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback(
    (slug: string, sizeId: WreathSizeId = "m", quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.slug === slug && i.sizeId === sizeId,
        );
        if (existing) {
          return prev.map((i) =>
            i.slug === slug && i.sizeId === sizeId
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        }
        return [...prev, { slug, sizeId, quantity }];
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
        const product = getWreath(i.slug);
        if (!product) return sum;
        const size = getWreathSize(product, i.sizeId);
        return sum + size.price * i.quantity;
      }, 0),
    [items],
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
    }),
    [items, addItem, removeItem, setQuantity, clear, count, total, hydrated],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { cartKey };
