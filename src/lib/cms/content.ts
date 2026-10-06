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

export function mergeWeddings(cms: CmsContent): Wedding[] {
  return baseWeddings.map((w) => {
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
}

export function mergeWedding(
  cms: CmsContent,
  slug: string,
): Wedding | undefined {
  return mergeWeddings(cms).find((w) => w.slug === slug);
}

export function mergeWreaths(cms: CmsContent): Wreath[] {
  return baseWreaths.map((w) => {
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
