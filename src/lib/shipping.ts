/**
 * Zásilkovna shipping: package tiers by wreath size + multi-parcel fees.
 *
 * Fees below are provisional until the official Packeta price list is applied.
 * Large wreaths (~60×50×40 cm, sum of sides ≈ 150 cm) use the "large" tier;
 * anything beyond that stays "large" with a note until Packeta confirms oversized rates.
 */

import type { DeliveryType } from "@/lib/checkout";
import type { WreathSizeId } from "@/data/wreaths";

export type PackageTier = "small" | "medium" | "large";

export type ShippingPackage = {
  /** Cart line index / wreath slug */
  itemSlug: string;
  itemName: string;
  sizeId: WreathSizeId | string;
  sizeLabel: string;
  tier: PackageTier;
  /** Human label for the box size */
  boxLabel: string;
  /** Approximate L×W×H in cm (for Packeta / admin) */
  dimensionsCm: { length: number; width: number; height: number };
  fee: number;
};

/** Map product size → packaging tier (one wreath = one box). */
export const SIZE_TO_TIER: Record<string, PackageTier> = {
  s: "small",
  m: "medium",
  l: "large",
};

/** Approx. outer box for each tier (cm). Large matches ~60×50×40. */
export const TIER_BOX: Record<
  PackageTier,
  { label: string; length: number; width: number; height: number }
> = {
  small: { label: "Menší balík", length: 40, width: 40, height: 15 },
  medium: { label: "Střední balík", length: 50, width: 50, height: 20 },
  large: { label: "Větší balík", length: 60, width: 50, height: 40 },
};

/**
 * Provisional Packeta CZ fees (Kč) per package.
 * Replace with numbers from the official ceník when available.
 */
export const TIER_FEES: Record<
  DeliveryType,
  Record<PackageTier, number>
> = {
  point: {
    small: 89,
    medium: 109,
    large: 149,
  },
  home: {
    small: 119,
    medium: 149,
    large: 199,
  },
};

export function tierForSizeId(sizeId: string | undefined): PackageTier {
  if (!sizeId) return "medium";
  return SIZE_TO_TIER[sizeId] ?? "medium";
}

export type CartShippingItem = {
  slug: string;
  name: string;
  sizeId: string;
  sizeLabel?: string;
  quantity: number;
};

/** One package per wreath unit — fragile floristry should not share a box. */
export function buildShippingPackages(
  items: CartShippingItem[],
  delivery: DeliveryType,
): ShippingPackage[] {
  const packages: ShippingPackage[] = [];
  for (const item of items) {
    const qty = Math.max(1, Math.floor(item.quantity) || 1);
    const tier = tierForSizeId(item.sizeId);
    const box = TIER_BOX[tier];
    const fee = TIER_FEES[delivery][tier];
    for (let i = 0; i < qty; i++) {
      packages.push({
        itemSlug: item.slug,
        itemName: item.name,
        sizeId: item.sizeId,
        sizeLabel: item.sizeLabel?.trim() || item.sizeId,
        tier,
        boxLabel: box.label,
        dimensionsCm: {
          length: box.length,
          width: box.width,
          height: box.height,
        },
        fee,
      });
    }
  }
  return packages;
}

export function shippingFeeFromPackages(packages: ShippingPackage[]) {
  return packages.reduce((sum, p) => sum + p.fee, 0);
}

export function summarizePackages(packages: ShippingPackage[]): string {
  if (packages.length === 0) return "";
  const counts: Partial<Record<PackageTier, number>> = {};
  for (const p of packages) {
    counts[p.tier] = (counts[p.tier] ?? 0) + 1;
  }
  const parts: string[] = [];
  if (counts.small) parts.push(`${counts.small}× menší`);
  if (counts.medium) parts.push(`${counts.medium}× střední`);
  if (counts.large) parts.push(`${counts.large}× větší`);
  const n = packages.length;
  return `${n} ${n === 1 ? "balík" : n < 5 ? "balíky" : "balíků"} (${parts.join(", ")})`;
}

/** Starting fee shown in delivery option list (cheapest tier). */
export function deliveryFeeFrom(delivery: DeliveryType) {
  return TIER_FEES[delivery].small;
}
