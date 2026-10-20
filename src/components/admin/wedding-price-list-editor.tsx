"use client";

import {
  weddingDecorPrices,
  weddingFlowerPrices,
} from "@/data/wedding-price-list";
import type { CmsContent, CmsPriceRow } from "@/lib/cms/types";

type SectionKey = "flowers" | "decor";

type Props = {
  content: CmsContent;
  onChange: (next: CmsContent["weddingPriceList"]) => void;
};

function rowsFor(
  content: CmsContent,
  key: SectionKey,
): CmsPriceRow[] {
  const saved = content.weddingPriceList?.[key];
  if (saved && saved.length > 0) return saved;
  return key === "flowers" ? weddingFlowerPrices : weddingDecorPrices;
}

export function WeddingPriceListEditor({ content, onChange }: Props) {
  function setSection(key: SectionKey, rows: CmsPriceRow[]) {
    onChange({
      ...content.weddingPriceList,
      [key]: rows,
    });
  }

  function updateRow(
    key: SectionKey,
    index: number,
    field: "item" | "price",
    value: string,
  ) {
    const rows = [...rowsFor(content, key)];
    const current = rows[index] ?? { item: "", price: "" };
    rows[index] = { ...current, [field]: value };
    setSection(key, rows);
  }

  function moveRow(key: SectionKey, index: number, direction: -1 | 1) {
    const rows = [...rowsFor(content, key)];
    const j = index + direction;
    if (j < 0 || j >= rows.length) return;
    [rows[index], rows[j]] = [rows[j]!, rows[index]!];
    setSection(key, rows);
  }

  function addRow(key: SectionKey) {
    setSection(key, [...rowsFor(content, key), { item: "", price: "" }]);
  }

  function removeRow(key: SectionKey, index: number) {
    setSection(
      key,
      rowsFor(content, key).filter((_, i) => i !== index),
    );
  }

  function Section({
    keyName,
    title,
  }: {
    keyName: SectionKey;
    title: string;
  }) {
    const rows = rowsFor(content, keyName);
    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-2xl text-moss-deep">{title}</h3>
          <button
            type="button"
            onClick={() => addRow(keyName)}
            className="border border-border px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-moss-deep transition-colors hover:bg-moss-deep hover:text-white"
          >
            + Řádek
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {rows.map((row, index) => (
            <div
              key={`${keyName}-${index}`}
              className="grid gap-2 border border-border/60 p-3 sm:grid-cols-[1fr_10rem_auto]"
            >
              <label className="block">
                <span className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                  Položka
                </span>
                <input
                  type="text"
                  value={row.item}
                  onChange={(e) =>
                    updateRow(keyName, index, "item", e.target.value)
                  }
                  className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-moss-deep"
                />
              </label>
              <label className="block">
                <span className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                  Cena
                </span>
                <input
                  type="text"
                  value={row.price}
                  onChange={(e) =>
                    updateRow(keyName, index, "price", e.target.value)
                  }
                  className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-moss-deep"
                />
              </label>
              <div className="flex flex-wrap items-end gap-1 sm:justify-end">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveRow(keyName, index, -1)}
                  className="border border-border px-2 py-2 text-[10px] tracking-[0.12em] uppercase text-moss-deep disabled:opacity-40"
                  aria-label="Nahoru"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={index === rows.length - 1}
                  onClick={() => moveRow(keyName, index, 1)}
                  className="border border-border px-2 py-2 text-[10px] tracking-[0.12em] uppercase text-moss-deep disabled:opacity-40"
                  aria-label="Dolů"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeRow(keyName, index)}
                  className="px-2 py-2 text-[10px] tracking-[0.12em] uppercase text-muted-foreground hover:bg-moss-deep hover:text-white"
                >
                  Smazat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div>
        <p className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
          Položky a ceny
        </p>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Upravte řádky ceníku. Po uložení se projeví na /svatby/cenik.
        </p>
      </div>
      <Section keyName="flowers" title="Svatební květiny" />
      <Section keyName="decor" title="Svatební výzdoba" />
    </section>
  );
}
