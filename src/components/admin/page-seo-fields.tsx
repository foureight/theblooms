"use client";

import {
  defaultPageSeo,
  PAGE_SEO,
  type CmsContent,
  type PageSeoId,
} from "@/lib/cms/types";

type Props = {
  pageId: PageSeoId;
  content: CmsContent;
  onChange: (pageId: PageSeoId, field: "title" | "description", value: string) => void;
};

export function PageSeoFields({ pageId, content, onChange }: Props) {
  const meta = PAGE_SEO.find((p) => p.id === pageId);
  if (!meta) return null;

  const defaults = defaultPageSeo(pageId);
  const title = content.pageSeo?.[pageId]?.title ?? defaults.title;
  const description =
    content.pageSeo?.[pageId]?.description ?? defaults.description;

  return (
    <section className="max-w-2xl border-b border-border pb-8">
      <p className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
        SEO stránky
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Meta pro {meta.path} — title a popis ve výsledcích vyhledávání a při
        sdílení.
      </p>
      <div className="mt-5 space-y-5">
        <label className="block">
          <span className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
            Meta title
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => onChange(pageId, "title", e.target.value)}
            className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-moss-deep"
          />
        </label>
        <label className="block">
          <span className="flex items-baseline justify-between gap-3 text-xs tracking-[0.14em] uppercase text-muted-foreground">
            Meta popis
            <span className="text-[11px] normal-case tracking-normal">
              {description.length} znaků · ideálně 150–160
            </span>
          </span>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => onChange(pageId, "description", e.target.value)}
            className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-moss-deep"
          />
        </label>
      </div>
    </section>
  );
}
