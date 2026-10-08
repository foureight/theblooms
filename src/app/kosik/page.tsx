"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/data/wreaths";
import { cartKey, resolveLine, useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CtaLink } from "@/components/cta-link";

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
  const [ordered, setOrdered] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-sm text-muted-foreground">
        Načítám košík…
      </div>
    );
  }

  if (ordered) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-5xl text-moss-deep">Objednávka přijata</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Děkuji. Brzy se ozvu s potvrzením a detaily doručení.
          {orderId ? (
            <>
              {" "}
              Číslo objednávky: <span className="font-medium text-foreground">{orderId}</span>.
            </>
          ) : null}
        </p>
        <CtaLink href="/vence" className="mt-8">
          Zpět k věncům
        </CtaLink>
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

  async function submitOrder() {
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Vyplňte prosím jméno a e-mail.");
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
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          note: note.trim(),
          items: payloadItems,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        order?: { id?: string };
      };
      if (!res.ok) {
        setError(data.error || "Objednávku se nepodařilo odeslat.");
        return;
      }
      setOrderId(data.order?.id || "");
      clear();
      setOrdered(true);
    } catch {
      setError("Síťová chyba při odesílání objednávky.");
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

      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">Celkem</p>
        <p className="text-xl font-medium">{formatPrice(total)}</p>
      </div>

      <section className="mt-10 space-y-5 border-t border-border pt-8">
        <h2 className="font-display text-3xl text-moss-deep">Kontaktní údaje</h2>
        <p className="text-sm text-muted-foreground">
          Abych věděla, komu objednávku potvrdit.
        </p>
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
              Poznámka / adresa{" "}
              <span className="text-muted-foreground">(volitelně)</span>
            </Label>
            <textarea
              id="order-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-border bg-white px-3 py-3 text-sm outline-none focus:border-bloom"
              placeholder="Doručovací adresa, termín, cokoliv důležitého…"
            />
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={() => void submitOrder()} disabled={submitting}>
          {submitting ? "Odesílám…" : "Dokončit objednávku"}
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
        Platební brána zatím není napojená — objednávku potvrdím e-mailem.
      </p>
    </div>
  );
}
