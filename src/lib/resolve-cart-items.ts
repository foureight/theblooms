import { getCmsContent, mergeWreath } from "@/lib/cms/content";
import { getWreathSizes, type WreathSizeId } from "@/data/wreaths";
import type { OrderItem } from "@/lib/orders-types";

const SIZE_IDS = new Set<WreathSizeId>(["s", "m", "l"]);
const MAX_LINES = 30;
const MAX_QTY = 20;

function asString(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Resolve cart lines from the catalog + CMS. Client may only send
 * slug, sizeId, and quantity — never a trusted price.
 */
export async function resolveCartItems(
  raw: unknown,
): Promise<{ items: OrderItem[] } | { error: string }> {
  if (!Array.isArray(raw) || raw.length === 0) {
    return { error: "Košík je prázdný nebo položky nelze odeslat." };
  }
  if (raw.length > MAX_LINES) {
    return { error: `V košíku může být nejvýše ${MAX_LINES} položek.` };
  }

  const cms = await getCmsContent();
  const items: OrderItem[] = [];

  for (const row of raw) {
    if (!row || typeof row !== "object") {
      return { error: "Neplatná položka v košíku." };
    }
    const r = row as Record<string, unknown>;
    const slug = asString(r.slug);
    const sizeRaw = asString(r.sizeId) || "m";
    const quantityRaw =
      typeof r.quantity === "number" ? r.quantity : Number(r.quantity);

    if (!slug) {
      return { error: "Chybí identifikátor produktu." };
    }
    if (!SIZE_IDS.has(sizeRaw as WreathSizeId)) {
      return { error: `Neznámá velikost „${sizeRaw}“.` };
    }
    if (
      !Number.isFinite(quantityRaw) ||
      quantityRaw < 1 ||
      quantityRaw > MAX_QTY
    ) {
      return {
        error: `Počet kusů musí být 1–${MAX_QTY} na položku.`,
      };
    }

    const product = mergeWreath(cms, slug);
    if (!product || !product.available) {
      return { error: `Produkt „${slug}“ není dostupný.` };
    }

    const sizeId = sizeRaw as WreathSizeId;
    const size = getWreathSizes(product).find((s) => s.id === sizeId);
    if (!size) {
      return {
        error: `Velikost „${sizeId}“ u „${product.name}“ není v nabídce.`,
      };
    }

    items.push({
      slug: product.slug,
      name: product.name,
      sizeId,
      sizeLabel: size.label,
      price: Math.round(size.price),
      quantity: Math.floor(quantityRaw),
      image: product.image || undefined,
    });
  }

  return { items };
}
