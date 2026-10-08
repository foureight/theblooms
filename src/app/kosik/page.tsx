"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice } from "@/data/wreaths";
import { PacketaPicker } from "@/components/packeta-picker";
import { CtaLink } from "@/components/cta-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SHIPPING_FEE_CZK,
  type PacketaPoint,
} from "@/lib/checkout";
import { cartKey, resolveLine, useCart } from "@/lib/cart";

const packetaKey =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_PACKETA_API_KEY?.trim() || ""
    : "";

export default function CartPage() {
  const {
    items,
    setQuantity,
    removeItem,
    total,
    clear,
    hydrated,
    catalog,
  } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [packeta, setPacketa] = useState<PacketaPoint | null>(null);

  const shipping = SHIPPING_FEE_CZK;
  const grandTotal = useMemo(() => total + shipping, [total, shipping]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-sm text-muted-foreground">
        Načítám košík…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-5xl text-moss-deep">Košík</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Košík je prázdný. Vyberte si věnec v e-shopu.
        </p>
        <CtaLink href="/vence" className="mt-8">
          Prohlédnout věnce
        </CtaLink>
      </div>
    );
  }

  async function payWithCard() {
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Vyplňte prosím jméno a e-mail.");
      return;
    }
    if (!packeta) {
      setError("Vyberte výdejní místo Zásilkovny.");
      return;
    }

    const payloadItems = items
      .map((item) => {
        const product = resolveLine(item, catalog);
        if (!product) return null;
        return {
          slug: item.slug,
          name: product.name,
          sizeId: item.sizeId,
          sizeLabel: product.sizeLabel,
          price: product.price,
          quantity: item.quantity,
          image: product.image,
        };
      })
      .filter(Boolean);

    if (payloadItems.length === 0) {
      setError("Košík je prázdný nebo položky nelze odeslat.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          note: note.trim(),
          items: payloadItems,
          packeta,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        url?: string;
      };
      if (!res.ok || !data.url) {
        setError(data.error || "Checkout se nepodařilo spustit.");
        return;
      }
      clear();
      window.location.href = data.url;
    } catch {
      setError("Síťová chyba při spouštění platby.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-5xl text-moss-deep sm:text-6xl">Košík</h1>
      <ul className="mt-10 divide-y divide-border">
        {items.map((item) => {
          const product = resolveLine(item, catalog);
          if (!product) return null;
          const key = cartKey(item.slug, item.sizeId);
          return (
            <li key={key} className="flex gap-4 py-6">
              <div className="relative size-24 shrink-0 overflow-hidden bg-stone sm:size-28">
                <Image
                  src={product.image || "/wreaths/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/vence/${item.slug}`}
                      className="font-display text-2xl text-moss-deep hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {product.sizeLabel
                        ? `${product.sizeLabel} · ${formatPrice(product.price)}`
                        : formatPrice(product.price)}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatPrice(product.price * item.quantity)}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Label htmlFor={`qty-${key}`} className="sr-only">
                    Množství
                  </Label>
                  <Input
                    id={`qty-${key}`}
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      setQuantity(
                        item.slug,
                        item.sizeId,
                        Number(e.target.value) || 1,
                      )
                    }
                    className="h-9 w-20"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.slug, item.sizeId)}
                    className="text-xs tracking-wide text-muted-foreground underline-offset-2 hover:underline"
                  >
                    Odebrat
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 space-y-2 border-t border-border pt-6 text-sm">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Zboží</p>
          <p className="font-medium">{formatPrice(total)}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Zásilkovna</p>
          <p className="font-medium">{formatPrice(shipping)}</p>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3 text-base">
          <p className="text-muted-foreground">Celkem</p>
          <p className="text-xl font-medium">{formatPrice(grandTotal)}</p>
        </div>
      </div>

      <section className="mt-10 space-y-5 border-t border-border pt-8">
        <h2 className="font-display text-3xl text-moss-deep">Kontaktní údaje</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="order-name">Jméno</Label>
            <Input
              id="order-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="h-11 rounded-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order-email">E-mail</Label>
            <Input
              id="order-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-11 rounded-none"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="order-phone">
              Telefon <span className="text-muted-foreground">(volitelně)</span>
            </Label>
            <Input
              id="order-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              className="h-11 rounded-none"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="order-note">
              Poznámka{" "}
              <span className="text-muted-foreground">(volitelně)</span>
            </Label>
            <textarea
              id="order-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-border bg-white px-3 py-3 text-sm outline-none focus:border-bloom"
              placeholder="Termín, vzkaz k balení…"
            />
          </div>
        </div>
      </section>

      <section className="mt-10 space-y-5 border-t border-border pt-8">
        <PacketaPicker
          value={packeta}
          onChange={setPacketa}
          apiKey={packetaKey}
        />
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={() => void payWithCard()} disabled={submitting}>
          {submitting ? "Přesměrovávám…" : "Zaplatit kartou"}
        </Button>
        <Link
          href="/vence"
          className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
        >
          Pokračovat v nákupu
        </Link>
      </div>
      {error ? (
        <p className="mt-4 text-sm text-destructive">{error}</p>
      ) : null}
      <p className="mt-4 text-xs text-muted-foreground">
        Platba kartou přes Stripe
        {packetaKey ? "" : " (lokálně demo bez API klíčů)"}. Doprava Zásilkovnou
        na výdejní místo.
      </p>
    </div>
  );
}
