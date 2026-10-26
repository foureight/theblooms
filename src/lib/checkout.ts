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

export type AddressFieldErrors = Partial<
  Record<"street" | "city" | "zip", string>
>;

/** CZ PSČ — 5 digits, optional space (120 00 / 12000). */
export function isValidCzZip(raw: string) {
  const digits = raw.replace(/\s/g, "");
  return /^\d{5}$/.test(digits);
}

/**
 * Street must include a house number (e.g. "Nuselská 12" or "Hlavní 12/3a").
 * Packeta HD requires street + houseNumber separately.
 */
export function streetHasHouseNumber(raw: string) {
  return /^.+\s+\d[\w\/\-]*$/u.test(raw.trim());
}

/** Local format checks before calling Packeta (always available). */
export function addressFieldErrors(
  address: DeliveryAddress,
): AddressFieldErrors {
  const errors: AddressFieldErrors = {};
  const street = address.street.trim();
  const city = address.city.trim();
  const zip = address.zip.trim();

  if (!street) {
    errors.street = "Vyplňte ulici a číslo popisné.";
  } else if (!streetHasHouseNumber(street)) {
    errors.street = "Doplňte číslo popisné (např. Nuselská 12).";
  } else if (street.length > 48) {
    errors.street = "Ulice je příliš dlouhá.";
  }

  if (!city) {
    errors.city = "Vyplňte město.";
  } else if (city.length < 2) {
    errors.city = "Město je příliš krátké.";
  }

  if (!zip) {
    errors.zip = "Vyplňte PSČ.";
  } else if (!isValidCzZip(zip)) {
    errors.zip = "PSČ musí mít 5 číslic (např. 140 00).";
  }

  return errors;
}

export function addressValidationError(address: DeliveryAddress): string {
  const e = addressFieldErrors(address);
  return e.street || e.city || e.zip || "";
}

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

/** First or last name — letters (incl. Czech), spaces, hyphen, apostrophe. */
export function isValidPersonName(raw: string) {
  const v = raw.trim();
  if (v.length < 2 || v.length > 60) return false;
  return /^[\p{L}][\p{L}\s'\-]*[\p{L}]$/u.test(v) || /^[\p{L}]{2,}$/u.test(v);
}

export function isValidEmail(raw: string) {
  const v = raw.trim();
  if (v.length < 5 || v.length > 120) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v);
}

export type ContactFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactFields, string>>;

/** Per-field messages for the cart contact form (empty vs invalid). */
export function contactFieldErrors(input: ContactFields): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  if (!input.firstName.trim()) {
    errors.firstName = "Vyplňte jméno.";
  } else if (!isValidPersonName(input.firstName)) {
    errors.firstName = "Jméno musí mít alespoň 2 písmena (bez číslic).";
  }

  if (!input.lastName.trim()) {
    errors.lastName = "Vyplňte příjmení.";
  } else if (!isValidPersonName(input.lastName)) {
    errors.lastName = "Příjmení musí mít alespoň 2 písmena (bez číslic).";
  }

  if (!input.email.trim()) {
    errors.email = "Vyplňte e-mail.";
  } else if (!isValidEmail(input.email)) {
    errors.email = "E-mail nevypadá správně (např. jmeno@domena.cz).";
  }

  if (!input.phone.trim()) {
    errors.phone = "Vyplňte telefon.";
  } else if (!isValidPhone(input.phone)) {
    errors.phone = "Telefon: 9 číslic, nebo +420… / +421…";
  }

  return errors;
}

export function contactValidationError(input: ContactFields): string {
  const errors = contactFieldErrors(input);
  return (
    errors.firstName ||
    errors.lastName ||
    errors.email ||
    errors.phone ||
    ""
  );
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
