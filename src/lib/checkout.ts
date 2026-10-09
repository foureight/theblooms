/** Zásilkovna shipping + Stripe card payment helpers. */

export type DeliveryType = "point" | "box" | "home";

export const DELIVERY_OPTIONS: Record<
  DeliveryType,
  { label: string; description: string; fee: number }
> = {
  point: {
    label: "Zásilkovna — výdejní místo",
    description: "Vyzvednete na pobočce Zásilkovny.",
    fee: 89,
  },
  box: {
    label: "Zásilkovna — Z-BOX",
    description: "Samoobslužný box, vyzvednutí 24/7.",
    fee: 89,
  },
  home: {
    label: "Zásilkovna — doručení na adresu",
    description: "Kurýr doručí až k vám domů.",
    fee: 129,
  },
};

export function deliveryFee(type: DeliveryType) {
  return DELIVERY_OPTIONS[type].fee;
}

export function isDeliveryType(v: unknown): v is DeliveryType {
  return v === "point" || v === "box" || v === "home";
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
