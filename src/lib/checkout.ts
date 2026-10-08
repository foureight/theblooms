/** Zásilkovna shipping + Stripe card payment helpers. */

export const SHIPPING_FEE_CZK = 89;

export type PacketaPoint = {
  id: string;
  name: string;
  city: string;
  street: string;
  zip: string;
  url?: string;
};

export function formatPacketaPoint(point: PacketaPoint) {
  const line = [point.street, point.zip, point.city].filter(Boolean).join(", ");
  return line ? `${point.name} — ${line}` : point.name;
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
