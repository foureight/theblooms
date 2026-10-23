"use client";

import { defaultFaqs } from "@/lib/cms/faqs";
import type { CmsContent, CmsFaqItem, FaqPageId } from "@/lib/cms/types";

type Props = {
  pageId: FaqPageId;
  label: string;
  content: CmsContent;
  onChange: (pageId: FaqPageId, items: CmsFaqItem[]) => void;
  onReset: (pageId: FaqPageId) => void;
};

export function FaqEditor({
  pageId,
  label,
  content,
  onChange,
  onReset,
}: Props) {
  const items: CmsFaqItem[] = Array.isArray(content.faqs?.[pageId])
    ? (content.faqs[pageId] as CmsFaqItem[])
    : defaultFaqs(pageId).map((f) => ({ ...f }));

  function update(next: CmsFaqItem[]) {
    onChange(pageId, next);
  }

  function setItem(index: number, patch: Partial<CmsFaqItem>) {
    update(
      items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function move(index: number, direction: -1 | 1) {
    const j = index + direction;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[index], next[j]] = [next[j]!, next[index]!];
    update(next);
  }

  return (
    <section className="space-y-4 border-t border-border/60 pt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-moss-deep">FAQ — {label}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Otázky a odpovědi v harmonice na stránce. Prázdnou otázku i odpověď
            při uložení vynecháme.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              update([...items, { question: "Nová otázka", answer: "" }])
            }
            className="bg-moss-deep px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-white hover:bg-bloom-light"
          >
            + Přidat otázku
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                !confirm(
                  "Obnovit výchozí FAQ z webu? Ruční úpravy této skupiny zmizí.",
                )
              ) {
                return;
              }
              onReset(pageId);
            }}
            className="px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-muted-foreground transition-colors hover:bg-moss-deep hover:text-white"
          >
            Výchozí
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={`${pageId}-${index}`}
            className="space-y-3 border border-border/70 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                Otázka {index + 1}
              </p>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  className="px-2 py-1 text-[10px] tracking-[0.12em] uppercase text-muted-foreground transition-colors hover:bg-moss-deep hover:text-white disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={index === items.length - 1}
                  onClick={() => move(index, 1)}
                  className="px-2 py-1 text-[10px] tracking-[0.12em] uppercase text-muted-foreground transition-colors hover:bg-moss-deep hover:text-white disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!confirm("Smazat tuto otázku?")) return;
                    update(items.filter((_, i) => i !== index));
                  }}
                  className="px-2 py-1 text-[10px] tracking-[0.12em] uppercase text-muted-foreground transition-colors hover:bg-moss-deep hover:text-white"
                >
                  Smazat
                </button>
              </div>
            </div>
            <label className="block">
              <span className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                Otázka
              </span>
              <input
                type="text"
                value={item.question}
                onChange={(e) => setItem(index, { question: e.target.value })}
                className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-bloom"
              />
            </label>
            <label className="block">
              <span className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                Odpověď
              </span>
              <textarea
                rows={3}
                value={item.answer}
                onChange={(e) => setItem(index, { answer: e.target.value })}
                className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm leading-relaxed outline-none focus:border-bloom"
              />
            </label>
          </div>
        ))}
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Žádné otázky — přidejte první, nebo obnovte výchozí.
          </p>
        ) : null}
      </div>
    </section>
  );
}
