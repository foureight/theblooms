import {
  decorations as baseDecorations,
  weddings as baseWeddings,
  type DecorationCategory,
  type Wedding,
} from "@/data/weddings";
import { wreaths as baseWreaths, type Wreath } from "@/data/wreaths";
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
    if (!o) return w;
    return {
      ...w,
      name: o.name?.trim() || w.name,
      description: o.description?.trim() || w.description,
      price: typeof o.price === "number" ? o.price : w.price,
      size: o.size?.trim() || w.size,
      season: o.season || w.season,
      available: typeof o.available === "boolean" ? o.available : w.available,
      image: o.image?.trim() || w.image,
    };
  });

  for (const [slug, o] of Object.entries(cms.wreaths ?? {})) {
    if (baseSlugs.has(slug)) continue;
    const name = o.name?.trim();
    if (!name) continue;
    merged.push({
      slug,
      name,
      description: o.description?.trim() || "",
      price: typeof o.price === "number" ? o.price : 0,
      size: o.size?.trim() || "Ø 33 cm",
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
