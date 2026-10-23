import {
  aboutFaqs,
  adventWreathFaqs,
  contactFaqs,
  flowerFaqs,
  homeFaqs,
  weddingFaqs,
  workshopFaqs,
  wreathFaqs,
} from "@/data/faqs";
import type { FaqItem } from "@/lib/seo";
import type { CmsContent, CmsFaqItem, FaqPageId } from "@/lib/cms/types";

export const FAQ_PAGES: {
  id: FaqPageId;
  label: string;
  /** Admin tab where this group is edited */
  tab: string;
  defaults: FaqItem[];
}[] = [
  { id: "home", label: "Úvod", tab: "home", defaults: homeFaqs },
  { id: "svatby", label: "Svatby", tab: "svatby", defaults: weddingFaqs },
  { id: "vence", label: "Věnce", tab: "vence", defaults: wreathFaqs },
  {
    id: "advent",
    label: "Adventní věnce",
    tab: "vence",
    defaults: adventWreathFaqs,
  },
  { id: "kytky", label: "Kytky", tab: "kytky", defaults: flowerFaqs },
  {
    id: "workshopy",
    label: "Workshopy",
    tab: "workshopy",
    defaults: workshopFaqs,
  },
  { id: "o-mne", label: "O mně", tab: "o-mne", defaults: aboutFaqs },
  { id: "kontakt", label: "Kontakt", tab: "kontakt", defaults: contactFaqs },
];

export function defaultFaqs(id: FaqPageId): FaqItem[] {
  return FAQ_PAGES.find((p) => p.id === id)?.defaults ?? [];
}

function cleanFaq(item: CmsFaqItem | undefined): FaqItem | null {
  if (!item || typeof item !== "object") return null;
  const question =
    typeof item.question === "string" ? item.question.trim() : "";
  const answer = typeof item.answer === "string" ? item.answer.trim() : "";
  if (!question && !answer) return null;
  return { question, answer };
}

/** CMS list wins when present; otherwise code defaults. */
export function mergeFaqs(cms: CmsContent, id: FaqPageId): FaqItem[] {
  const stored = cms.faqs?.[id];
  if (!Array.isArray(stored)) return defaultFaqs(id);
  return stored.map(cleanFaq).filter((f): f is FaqItem => Boolean(f));
}

export function sanitizeFaqs(
  raw: unknown,
): Partial<Record<FaqPageId, CmsFaqItem[]>> {
  if (!raw || typeof raw !== "object") return {};
  const out: Partial<Record<FaqPageId, CmsFaqItem[]>> = {};
  for (const page of FAQ_PAGES) {
    const list = (raw as Record<string, unknown>)[page.id];
    if (!Array.isArray(list)) continue;
    out[page.id] = list
      .map((row) => {
        if (!row || typeof row !== "object") return null;
        const r = row as CmsFaqItem;
        const question = typeof r.question === "string" ? r.question : "";
        const answer = typeof r.answer === "string" ? r.answer : "";
        if (!question.trim() && !answer.trim()) return null;
        return { question, answer };
      })
      .filter((f): f is CmsFaqItem => Boolean(f));
  }
  return out;
}
