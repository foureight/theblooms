import {
  decorations as baseDecorations,
  weddings as baseWeddings,
  type DecorationCategory,
  type Wedding,
} from "@/data/weddings";
import {
  DEFAULT_SIZE_LABELS,
  defaultWreathSizes,
  getWreathSizes,
  wreaths as baseWreaths,
  type Wreath,
  type WreathSizeId,
  type WreathSizeOption,
} from "@/data/wreaths";
import type { CmsWreathOverride } from "@/lib/cms/types";

function mergeWreathSizes(
  basePrice: number,
  baseSize: string,
  o?: CmsWreathOverride,
): WreathSizeOption[] {
  const defaults = defaultWreathSizes(
    typeof o?.price === "number" ? o.price : basePrice,
  ).map((s) =>
    s.id === "m" && (o?.size?.trim() || baseSize)
      ? { ...s, label: (o?.size?.trim() || baseSize).trim() }
      : s,
  );
  if (!o?.sizes || o.sizes.length === 0) return defaults;
  const byId = new Map(
    o.sizes
      .filter((s) => s && (s.id === "s" || s.id === "m" || s.id === "l"))
      .map((s) => [s.id as WreathSizeId, s]),
  );
  return (["s", "m", "l"] as WreathSizeId[]).map((id) => {
    const fallback = defaults.find((d) => d.id === id)!;
    const override = byId.get(id);
    if (!override) return fallback;
    return {
      id,
      label: override.label?.trim() || fallback.label || DEFAULT_SIZE_LABELS[id],
      price:
        typeof override.price === "number" && Number.isFinite(override.price)
          ? override.price
          : fallback.price,
    };
  });
}
import {
  defaultText,
  PAGE_TEXTS,
  type CmsContent,
} from "@/lib/cms/types";
import { readCms, resolveSlot, resolveText } from "@/lib/cms/store";

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
      title: o.title?.trim() || w.title,
      place: o.place?.trim() || w.place,
      season: o.season?.trim() || w.season,
      summary: o.summary?.trim() || w.summary,
      cover: o.cover?.trim() || w.cover,
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
      cover: o.cover?.trim() || WEDDING_PLACEHOLDER,
      images:
        o.images && o.images.length > 0
          ? o.images.filter(Boolean)
          : [o.cover?.trim() || WEDDING_PLACEHOLDER],
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
      return { ...w, sizes: getWreathSizes(w) };
    }
    const sizes = mergeWreathSizes(w.price, w.size, o);
    const medium = sizes.find((s) => s.id === "m") ?? sizes[1]!;
    return {
      ...w,
      name: o.name?.trim() || w.name,
      description: o.description?.trim() || w.description,
      price: medium.price,
      size: medium.label,
      sizes,
      season: o.season || w.season,
      available: typeof o.available === "boolean" ? o.available : w.available,
      image: o.image?.trim() || w.image,
    };
  });

  for (const [slug, o] of Object.entries(cms.wreaths ?? {})) {
    if (baseSlugs.has(slug)) continue;
    const name = o.name?.trim();
    if (!name) continue;
    const sizes = mergeWreathSizes(o.price ?? 990, o.size || "Ø 33 cm", o);
    const medium = sizes.find((s) => s.id === "m") ?? sizes[1]!;
    merged.push({
      slug,
      name,
      description: o.description?.trim() || "",
      price: medium.price,
      size: medium.label,
      sizes,
      season: o.season || "Jaro",
      available: typeof o.available === "boolean" ? o.available : true,
      image: o.image?.trim() || WREATH_PLACEHOLDER,
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
      title: o.title?.trim() || d.title,
      description: o.description?.trim() || d.description,
      image: o.image?.trim() || d.image,
      variants: d.variants.map((v) => {
        const vo = o.variants?.[v.slug];
        if (!vo) return v;
        return {
          ...v,
          name: vo.name?.trim() || v.name,
          note: vo.note?.trim() || v.note,
          image: vo.image?.trim() || v.image,
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
      title,
      text: o.text?.trim() || "",
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
