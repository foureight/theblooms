import {
  decorations as baseDecorations,
  weddings as baseWeddings,
  type DecorationCategory,
  type Wedding,
} from "@/data/weddings";
import {
  getWreathSizeSlots,
  getWreathSizes,
  legacyWreathSize,
  wreaths as baseWreaths,
  type Wreath,
  type WreathSizeOption,
} from "@/data/wreaths";
import type { CmsWreathOverride } from "@/lib/cms/types";
import {
  defaultText,
  PAGE_TEXTS,
  type CmsContent,
} from "@/lib/cms/types";
import { readCms, resolveSlot, resolveText } from "@/lib/cms/store";
import { fixCzechOrphans } from "@/lib/typography";

/**
 * Admin / CMS always wins when a value is present.
 * Code defaults are only a fallback for missing fields.
 */
function cmsString(
  override: string | undefined,
  fallback: string,
): string {
  if (typeof override === "string") {
    const trimmed = override.trim();
    if (trimmed) return fixCzechOrphans(trimmed);
  }
  return fixCzechOrphans(fallback);
}

function cmsNumber(
  override: number | undefined,
  fallback: number,
): number {
  return typeof override === "number" && Number.isFinite(override)
    ? override
    : fallback;
}

function cmsBool(
  override: boolean | undefined,
  fallback: boolean,
): boolean {
  return typeof override === "boolean" ? override : fallback;
}

/** Size slots from admin only — never invent S/L from code defaults. */
function mergeWreathSizeSlots(
  basePrice: number,
  baseSize: string,
  o?: CmsWreathOverride,
): WreathSizeOption[] | undefined {
  if (!o?.sizes || o.sizes.length === 0) return undefined;
  const price = cmsNumber(o.price, basePrice);
  const size = cmsString(o.size, baseSize);
  return getWreathSizeSlots({ price, size, sizes: o.sizes });
}

function syncPriceFromSizes(
  sizes: WreathSizeOption[] | undefined,
  adminPrice: number | undefined,
  adminSize: string | undefined,
  fallbackPrice: number,
  fallbackSize: string,
) {
  const priceFallback = cmsNumber(adminPrice, fallbackPrice);
  const sizeFallback = cmsString(adminSize, fallbackSize);

  if (!sizes || sizes.length === 0) {
    return {
      price: priceFallback,
      size: sizeFallback,
      sizes: undefined as WreathSizeOption[] | undefined,
    };
  }

  const active = getWreathSizes({
    price: priceFallback,
    size: sizeFallback,
    sizes,
  });
  const primary =
    active.find((s) => s.id === "m") ??
    active[0] ??
    legacyWreathSize({ price: priceFallback, size: sizeFallback });

  // Explicit admin price/size still win over derived medium
  return {
    price: cmsNumber(adminPrice, primary.price),
    size: cmsString(adminSize, primary.label),
    sizes,
  };
}

export async function getCmsContent() {
  return readCms();
}

export function textFrom(
  cms: CmsContent,
  id: (typeof PAGE_TEXTS)[number]["id"],
) {
  return resolveText(cms, id, defaultText(id));
}

export function slotFrom(cms: CmsContent, id: string, fallback: string) {
  return resolveSlot(cms, id, fallback);
}

/** Contact block for footer / kontakt — admin texts win over code defaults. */
export type SiteContact = {
  name: string;
  owner: string;
  email: string;
  phone: string;
  location: string;
  instagramHandle: string;
  instagram: string;
};

export function mergeSiteContact(cms: CmsContent): SiteContact {
  const handle = textFrom(cms, "kontakt.instagram").replace(/^@/, "");
  return {
    name: "THE BLOOMS",
    owner: textFrom(cms, "kontakt.owner"),
    email: textFrom(cms, "kontakt.email"),
    phone: textFrom(cms, "kontakt.phone"),
    location: textFrom(cms, "kontakt.location"),
    instagramHandle: handle,
    instagram: `https://instagram.com/${handle}`,
  };
}

const WREATH_PLACEHOLDER = "/wreaths/placeholder.svg";
const WEDDING_PLACEHOLDER =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80";

export function mergeWeddings(cms: CmsContent): Wedding[] {
  const baseSlugs = new Set(baseWeddings.map((w) => w.slug));
  const merged = baseWeddings.map((w) => {
    const o = cms.weddings[w.slug];
    if (!o) return w;
    return {
      ...w,
      title: cmsString(o.title, w.title),
      place: cmsString(o.place, w.place),
      season: cmsString(o.season, w.season),
      summary: cmsString(o.summary, w.summary),
      cover: cmsString(o.cover, w.cover),
      images:
        o.images && o.images.length > 0
          ? o.images.filter(Boolean)
          : w.images,
    };
  });

  for (const [slug, o] of Object.entries(cms.weddings ?? {})) {
    if (baseSlugs.has(slug)) continue;
    const title = o.title?.trim();
    if (!title) continue;
    merged.push({
      slug,
      title,
      place: o.place?.trim() || "",
      season: o.season?.trim() || "",
      summary: o.summary?.trim() || "",
      cover: cmsString(o.cover, WEDDING_PLACEHOLDER),
      images:
        o.images && o.images.length > 0
          ? o.images.filter(Boolean)
          : [cmsString(o.cover, WEDDING_PLACEHOLDER)],
    });
  }

  return merged;
}

export function mergeWedding(
  cms: CmsContent,
  slug: string,
): Wedding | undefined {
  return mergeWeddings(cms).find((w) => w.slug === slug);
}

export function mergeWreaths(cms: CmsContent): Wreath[] {
  const baseSlugs = new Set(baseWreaths.map((w) => w.slug));
  const merged = baseWreaths.map((w) => {
    const o = cms.wreaths[w.slug];
    if (!o) {
      return { ...w };
    }
    const slots = mergeWreathSizeSlots(w.price, w.size, o);
    const synced = syncPriceFromSizes(
      slots,
      o.price,
      o.size,
      w.price,
      w.size,
    );
    return {
      ...w,
      name: cmsString(o.name, w.name),
      description: cmsString(o.description, w.description),
      price: synced.price,
      size: synced.size,
      sizes: synced.sizes,
      season: (cmsString(o.season, w.season) || w.season) as Wreath["season"],
      available: cmsBool(o.available, w.available),
      image: cmsString(o.image, w.image),
    };
  });

  for (const [slug, o] of Object.entries(cms.wreaths ?? {})) {
    if (baseSlugs.has(slug)) continue;
    const name = o.name?.trim();
    if (!name) continue;
    const basePrice = cmsNumber(o.price, 990);
    const baseSize = cmsString(o.size, "Ø 30 cm");
    const slots = mergeWreathSizeSlots(basePrice, baseSize, o);
    const synced = syncPriceFromSizes(
      slots,
      o.price,
      o.size,
      basePrice,
      baseSize,
    );
    const seasonRaw = o.season?.trim();
    const season: Wreath["season"] =
      seasonRaw === "Jaro" || seasonRaw === "Podzim" || seasonRaw === "Advent"
        ? seasonRaw
        : "Jaro";
    merged.push({
      slug,
      name,
      description: o.description?.trim() || "",
      price: synced.price,
      size: synced.size,
      sizes: synced.sizes,
      season,
      available: cmsBool(o.available, true),
      image: cmsString(o.image, WREATH_PLACEHOLDER),
    });
  }

  const order = resolveWreathOrder(cms);
  const rank = new Map(order.map((slug, i) => [slug, i]));
  return [...merged].sort(
    (a, b) => (rank.get(a.slug) ?? 999) - (rank.get(b.slug) ?? 999),
  );
}

/** Default: dostupné nahoře (prodejnější), pak původní pořadí */
export function defaultWreathOrder(): string[] {
  const available = baseWreaths.filter((w) => w.available).map((w) => w.slug);
  const rest = baseWreaths.filter((w) => !w.available).map((w) => w.slug);
  return [...available, ...rest];
}

export function resolveWreathOrder(cms: CmsContent): string[] {
  const base = baseWreaths.map((w) => w.slug);
  const custom = Object.entries(cms.wreaths ?? {})
    .filter(([slug, o]) => !base.includes(slug) && Boolean(o.name?.trim()))
    .map(([slug]) => slug);
  const all = [...base, ...custom];
  const saved = (cms.wreathOrder ?? []).filter((s) => all.includes(s));
  if (saved.length === 0) return [...defaultWreathOrder(), ...custom];
  const missing = all.filter((s) => !saved.includes(s));
  return [...saved, ...missing];
}

export function mergeWreath(cms: CmsContent, slug: string): Wreath | undefined {
  return mergeWreaths(cms).find((w) => w.slug === slug);
}

export function mergeDecorations(cms: CmsContent): DecorationCategory[] {
  return baseDecorations.map((d) => {
    const o = cms.decorations[d.slug];
    if (!o) return d;
    return {
      ...d,
      title: cmsString(o.title, d.title),
      description: cmsString(o.description, d.description),
      image: cmsString(o.image, d.image),
      variants: d.variants.map((v) => {
        const vo = o.variants?.[v.slug];
        if (!vo) return v;
        return {
          ...v,
          name: cmsString(vo.name, v.name),
          note: cmsString(vo.note, v.note),
          image: cmsString(vo.image, v.image),
        };
      }),
    };
  });
}

export function mergeDecoration(
  cms: CmsContent,
  slug: string,
): DecorationCategory | undefined {
  return mergeDecorations(cms).find((d) => d.slug === slug);
}

export type CmsCard = {
  slug: string;
  title: string;
  text: string;
  image?: string;
  custom: boolean;
};

function mergeServiceCards(
  overrides: Record<
    string,
    { custom?: boolean; title?: string; text?: string; image?: string }
  >,
): CmsCard[] {
  const cards: CmsCard[] = [];
  for (const [slug, o] of Object.entries(overrides ?? {})) {
    const title = o.title?.trim();
    if (!title) continue;
    cards.push({
      slug,
      title: fixCzechOrphans(title),
      text: fixCzechOrphans(o.text?.trim() || ""),
      image: o.image?.trim() || undefined,
      custom: true,
    });
  }
  return cards;
}

/** Extra workshop cards from CMS (appended after built-in formats). */
export function mergeWorkshopCards(cms: CmsContent): CmsCard[] {
  return mergeServiceCards(cms.workshops ?? {});
}

/** Extra flower-service cards from CMS (appended after built-in services). */
export function mergeFlowerCards(cms: CmsContent): CmsCard[] {
  return mergeServiceCards(cms.flowers ?? {});
}
