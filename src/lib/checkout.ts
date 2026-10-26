/** Zásilkovna shipping + Stripe card payment helpers. */

import {
  deliveryFeeFrom,
  type CartShippingItem,
  type ShippingPackage,
  buildShippingPackages,
  shippingFeeFromPackages,
  summarizePackages,
} from "@/lib/shipping";

export type DeliveryType = "point" | "home";

export const DELIVERY_OPTIONS: Record<
  DeliveryType,
  { label: string; description: string; feeFrom: number }
> = {
  point: {
    label: "Zásilkovna — výdejní místo",
    description: "Kamenná pobočka Zásilkovny — bez Z-BOXů.",
    feeFrom: deliveryFeeFrom("point"),
  },
  home: {
    label: "Zásilkovna — doručení na adresu",
    description: "Kurýr doručí až k vám domů.",
    feeFrom: deliveryFeeFrom("home"),
  },
};

/** @deprecated Prefer calculateShipping — kept for simple single-package fallbacks. */
export function deliveryFee(type: DeliveryType) {
  return deliveryFeeFrom(type);
}

export function isDeliveryType(v: unknown): v is DeliveryType {
  return v === "point" || v === "home";
}

export type PacketaPoint = {
  id: string;
  name: string;
  city: string;
  street: string;
  zip: string;
  url?: string;
};

export type DeliveryAddress = {
  street: string;
  city: string;
  zip: string;
};

export function formatPacketaPoint(point: PacketaPoint) {
  const line = [point.street, point.zip, point.city].filter(Boolean).join(", ");
  return line ? `${point.name} — ${line}` : point.name;
}

export function formatAddress(a: DeliveryAddress) {
  return [a.street, [a.zip, a.city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
}

export function calculateShipping(
  items: CartShippingItem[],
  delivery: DeliveryType,
): {
  packages: ShippingPackage[];
  fee: number;
  summary: string;
} {
  const packages = buildShippingPackages(items, delivery);
  return {
    packages,
    fee: shippingFeeFromPackages(packages),
    summary: summarizePackages(packages),
  };
}

/** Basic CZ/SK mobile or landline — required for all Packeta deliveries. */
export function isValidPhone(raw: string) {
  const digits = raw.replace(/[\s\-()./+]/g, "");
  if (/^420\d{9}$/.test(digits)) return true;
  if (/^421\d{9}$/.test(digits)) return true;
  if (/^\d{9}$/.test(digits)) return true;
  return false;
}

export function isStripeConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim(),
  );
}

export function packetaApiKey() {
  return (
    process.env.NEXT_PUBLIC_PACKETA_API_KEY?.trim() ||
    process.env.PACKETA_API_KEY?.trim() ||
    ""
  );
}

export type { ShippingPackage, CartShippingItem };
