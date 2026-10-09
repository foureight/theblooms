"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { formatPrice } from "@/data/wreaths";
import { PacketaPicker } from "@/components/packeta-picker";
import { CtaLink } from "@/components/cta-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DELIVERY_OPTIONS,
  formatAddress,
  type DeliveryAddress,
  type DeliveryType,
  type PacketaPoint,
} from "@/lib/checkout";
import { cartKey, resolveLine, useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const packetaKey = process.env.NEXT_PUBLIC_PACKETA_API_KEY?.trim() || "";

type SectionId = "contact" | "delivery" | "payment";

const DELIVERY_ORDER: DeliveryType[] = ["point", "box", "home"];

function AccordionSection({
  index,
  title,
  summary,
  done,
  open,
  onToggle,
  children,
}: {
  index: number;
  title: string;
  summary?: string;
  done: boolean;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-bloom/30">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-6 py-4 text-left sm:py-5"
      >
        <span className="min-w-0">
          <span className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium",
                done
                  ? "bg-moss-deep text-white"
                  : "border border-moss-deep/30 text-moss-deep",
              )}
            >
              {done ? <Check className="size-3.5" /> : index}
            </span>
            <span className="font-display text-xl text-moss-deep sm:text-2xl">
              {title}
            </span>
          </span>
          {!open && summary ? (
            <span className="mt-1 block truncate pl-9 text-sm text-muted-foreground">
              {summary}
            </span>
          ) : null}
        </span>
        <span
          aria-hidden
          className={cn(
            "mt-1.5 shrink-0 text-lg leading-none text-moss-deep/50 transition-transform sm:mt-2 sm:text-xl",
            open && "rotate-45",
          )}
        >
          +
        </span>
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-6 sm:pl-9">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { items, setQuantity, removeItem, total, hydrated, catalog } =
    useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [delivery, setDelivery] = useState<DeliveryType>("point");
  const [points, setPoints] = useState<
    Record<"point" | "box", PacketaPoint | null>
  >({ point: null, box: null });
  const [address, setAddress] = useState<DeliveryAddress>({
    street: "",
    city: "",
    zip: "",
  });
  const [wantsInvoice, setWantsInvoice] = useState(false);
  const [billing, setBilling] = useState({
    company: "",
    ico: "",
    dic: "",
    street: "",
    city: "",
    zip: "",
  });
  const [open, setOpen] = useState<Record<SectionId, boolean>>({
    contact: true,
    delivery: false,
    payment: false,
  });

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

  const shipping = DELIVERY_OPTIONS[delivery].fee;
  const grandTotal = total + shipping;
  const point = delivery === "home" ? null : points[delivery];
  const needsPhone = delivery === "home";

  const billingError = !wantsInvoice
    ? ""
    : !billing.company.trim()
      ? "Vyplňte název firmy."
      : !/^\d{8}$/.test(billing.ico.replace(/\s/g, ""))
        ? "IČO musí mít 8 číslic."
        : !billing.street.trim() || !billing.city.trim() || !billing.zip.trim()
          ? "Vyplňte fakturační adresu."
          : "";
  const contactError = !name.trim()
    ? "Vyplňte jméno."
    : !/^\S+@\S+\.\S+$/.test(email.trim())
      ? "Vyplňte platný e-mail."
      : billingError;
  const deliveryError =
    delivery === "home"
      ? !address.street.trim() || !address.city.trim() || !address.zip.trim()
        ? "Vyplňte ulici, město a PSČ."
        : !phone.trim()
          ? "Pro kurýra vyplňte v kontaktu telefon."
          : ""
      : !point
        ? delivery === "box"
          ? "Vyberte Z-BOX."
          : "Vyberte výdejní místo."
        : "";

  const contactSummary = [
    name.trim(),
    email.trim(),
    wantsInvoice && billing.company.trim()
      ? `faktura: ${billing.company.trim()}`
      : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const deliverySummary =
    delivery === "home"
      ? `Na adresu${formatAddress(address) ? ` — ${formatAddress(address)}` : ""}`
      : point
        ? point.name
        : DELIVERY_OPTIONS[delivery].label;

  function toggle(id: SectionId) {
    setOpen((o) => ({ ...o, [id]: !o[id] }));
  }

  function advance(from: SectionId, to: SectionId, sectionError: string) {
    if (sectionError) {
      setError(sectionError);
      return;
    }
    setError("");
    setOpen((o) => ({ ...o, [from]: false, [to]: true }));
  }

  async function payWithCard() {
    setError("");
    if (contactError) {
      setOpen((o) => ({ ...o, contact: true }));
      setError(contactError);
      return;
    }
    if (deliveryError) {
      setOpen((o) => ({
        ...o,
        delivery: true,
        contact: deliveryError.includes("telefon") ? true : o.contact,
      }));
      setError(deliveryError);
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
          delivery,
          packeta: point,
          address: delivery === "home" ? address : undefined,
          billing: wantsInvoice ? billing : undefined,
        }),
      });
      const data = (await res.json()) as { error?: string; url?: string };
      if (!res.ok || !data.url) {
        setError(data.error || "Platbu se nepodařilo spustit.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Síťová chyba při spouštění platby.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
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

      <div className="mt-10 border-b border-bloom/30">
        <AccordionSection
          index={1}
          title="Kontakt"
          summary={contactSummary}
          done={!contactError}
          open={open.contact}
          onToggle={() => toggle("contact")}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="order-name">Jméno a příjmení</Label>
              <Input
                id="order-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                autoComplete="email"
                className="h-11 rounded-none"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="order-phone">
                Telefon{" "}
                <span className="text-muted-foreground">
                  {needsPhone ? "(pro kurýra)" : "(volitelně)"}
                </span>
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

          <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-moss-deep">
            <input
              type="checkbox"
              checked={wantsInvoice}
              onChange={(e) => {
                setWantsInvoice(e.target.checked);
                setError("");
              }}
              className="size-4 accent-moss-deep"
            />
            Chci fakturu na firmu
          </label>

          {wantsInvoice ? (
            <div className="mt-4 grid gap-4 border-l-2 border-bloom/30 pl-4 sm:grid-cols-3">
              <div className="space-y-2 sm:col-span-3">
                <Label htmlFor="bill-company">Název firmy</Label>
                <Input
                  id="bill-company"
                  value={billing.company}
                  onChange={(e) =>
                    setBilling((b) => ({ ...b, company: e.target.value }))
                  }
                  autoComplete="organization"
                  className="h-11 rounded-none"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="bill-ico">IČO</Label>
                <Input
                  id="bill-ico"
                  value={billing.ico}
                  onChange={(e) =>
                    setBilling((b) => ({ ...b, ico: e.target.value }))
                  }
                  inputMode="numeric"
                  maxLength={10}
                  className="h-11 rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bill-dic">
                  DIČ <span className="text-muted-foreground">(volitelně)</span>
                </Label>
                <Input
                  id="bill-dic"
                  value={billing.dic}
                  onChange={(e) =>
                    setBilling((b) => ({ ...b, dic: e.target.value }))
                  }
                  placeholder="CZ…"
                  className="h-11 rounded-none"
                />
              </div>
              <div className="space-y-2 sm:col-span-3">
                <Label htmlFor="bill-street">Ulice a číslo popisné</Label>
                <Input
                  id="bill-street"
                  value={billing.street}
                  onChange={(e) =>
                    setBilling((b) => ({ ...b, street: e.target.value }))
                  }
                  autoComplete="billing street-address"
                  className="h-11 rounded-none"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="bill-city">Město</Label>
                <Input
                  id="bill-city"
                  value={billing.city}
                  onChange={(e) =>
                    setBilling((b) => ({ ...b, city: e.target.value }))
                  }
                  autoComplete="billing address-level2"
                  className="h-11 rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bill-zip">PSČ</Label>
                <Input
                  id="bill-zip"
                  value={billing.zip}
                  onChange={(e) =>
                    setBilling((b) => ({ ...b, zip: e.target.value }))
                  }
                  inputMode="numeric"
                  autoComplete="billing postal-code"
                  className="h-11 rounded-none"
                />
              </div>
            </div>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="mt-5"
            onClick={() => advance("contact", "delivery", contactError)}
          >
            Pokračovat na doručení
          </Button>
        </AccordionSection>

        <AccordionSection
          index={2}
          title="Doručení — Zásilkovna"
          summary={deliverySummary}
          done={!deliveryError}
          open={open.delivery}
          onToggle={() => toggle("delivery")}
        >
          <div role="radiogroup" aria-label="Způsob doručení" className="space-y-2">
            {DELIVERY_ORDER.map((type) => {
              const option = DELIVERY_OPTIONS[type];
              const active = delivery === type;
              return (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setDelivery(type);
                    setError("");
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 border px-4 py-3 text-left transition-colors",
                    active
                      ? "border-moss-deep bg-white"
                      : "border-border bg-white/60 hover:border-moss-deep/40",
                  )}
                >
                  <span className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-1 size-4 shrink-0 rounded-full border",
                        active
                          ? "border-[5px] border-moss-deep"
                          : "border-moss-deep/40",
                      )}
                    />
                    <span>
                      <span className="block text-sm font-medium text-moss-deep">
                        {option.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-medium">
                    {formatPrice(option.fee)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            {delivery === "home" ? (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2 sm:col-span-3">
                  <Label htmlFor="addr-street">Ulice a číslo popisné</Label>
                  <Input
                    id="addr-street"
                    value={address.street}
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, street: e.target.value }))
                    }
                    autoComplete="street-address"
                    className="h-11 rounded-none"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="addr-city">Město</Label>
                  <Input
                    id="addr-city"
                    value={address.city}
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, city: e.target.value }))
                    }
                    autoComplete="address-level2"
                    className="h-11 rounded-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addr-zip">PSČ</Label>
                  <Input
                    id="addr-zip"
                    value={address.zip}
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, zip: e.target.value }))
                    }
                    inputMode="numeric"
                    autoComplete="postal-code"
                    className="h-11 rounded-none"
                  />
                </div>
              </div>
            ) : (
              <PacketaPicker
                key={delivery}
                mode={delivery}
                value={points[delivery]}
                onChange={(p) => {
                  setPoints((s) => ({ ...s, [delivery]: p }));
                  setError("");
                }}
                apiKey={packetaKey}
              />
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-5"
            onClick={() => advance("delivery", "payment", deliveryError)}
          >
            Pokračovat na platbu
          </Button>
        </AccordionSection>

        <AccordionSection
          index={3}
          title="Platba kartou"
          summary="Online kartou — Visa, Mastercard, Apple Pay, Google Pay"
          done={!contactError && !deliveryError}
          open={open.payment}
          onToggle={() => toggle("payment")}
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            Po kliknutí na „Zaplatit kartou“ vás přesměruji na zabezpečenou
            platební bránu Stripe. Věnec připravím po připsání platby.
          </p>
        </AccordionSection>
      </div>

      <div className="mt-8 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Zboží</p>
          <p className="font-medium">{formatPrice(total)}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {DELIVERY_OPTIONS[delivery].label}
          </p>
          <p className="font-medium">{formatPrice(shipping)}</p>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3 text-base">
          <p className="text-muted-foreground">Celkem</p>
          <p className="text-xl font-medium">{formatPrice(grandTotal)}</p>
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          size="lg"
          onClick={() => void payWithCard()}
          disabled={submitting}
        >
          {submitting
            ? "Přesměrovávám…"
            : `Zaplatit kartou · ${formatPrice(grandTotal)}`}
        </Button>
        <Link
          href="/vence"
          className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
        >
          Pokračovat v nákupu
        </Link>
      </div>
    </div>
  );
}
