"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { weddings as baseWeddings } from "@/data/weddings";
import { wreaths as baseWreaths } from "@/data/wreaths";
import {
  defaultText,
  PAGE_SLOTS,
  PAGE_TEXTS,
  slugifyTitle,
  type CmsContent,
  type MediaItem,
} from "@/lib/cms/types";
import { cn } from "@/lib/utils";

type Tab =
  | "texty"
  | "fotky"
  | "svatby"
  | "vence"
  | "workshopy"
  | "kytky"
  | "media";

const WREATH_PLACEHOLDER = "/wreaths/placeholder.svg";
const WEDDING_PLACEHOLDER =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80";

type Props = {
  initialContent: CmsContent;
  initialMedia: MediaItem[];
};

export function AdminDashboard({ initialContent, initialMedia }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("texty");
  const [content, setContent] = useState<CmsContent>(initialContent);
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pickerFor, setPickerFor] = useState<null | {
    kind: "slot" | "wedding-cover" | "wedding-gallery" | "wreath";
    key: string;
  }>(null);

  const tabs: { id: Tab; label: string }[] = [
    { id: "texty", label: "Texty" },
    { id: "fotky", label: "Fotky stránek" },
    { id: "svatby", label: "Svatby" },
    { id: "vence", label: "Věnce" },
    { id: "workshopy", label: "Workshopy" },
    { id: "kytky", label: "Kytky" },
    { id: "media", label: "Knihovna" },
  ];

  async function save() {
    setSaving(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setStatus(data.error || "Uložení selhalo.");
        return;
      }
      setStatus("Uloženo.");
      router.refresh();
    } catch {
      setStatus("Síťová chyba při ukládání.");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function upload(file: File) {
    setUploading(true);
    setStatus("");
    try {
      const form = new FormData();
      form.set("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: form });
      const data = (await res.json()) as {
        error?: string;
        name?: string;
        url?: string;
      };
      if (!res.ok || !data.url || !data.name) {
        setStatus(data.error || "Upload selhal.");
        return null;
      }
      const item: MediaItem = {
        name: data.name,
        url: data.url,
        size: file.size,
        updatedAt: new Date().toISOString(),
      };
      setMedia((prev) => [item, ...prev]);
      setStatus("Fotka nahrána.");
      return item;
    } catch {
      setStatus("Síťová chyba při uploadu.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function removeMedia(name: string) {
    if (!confirm(`Smazat ${name}?`)) return;
    const res = await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setStatus(data.error || "Smazání selhalo.");
      return;
    }
    setMedia((prev) => prev.filter((m) => m.name !== name));
    setStatus("Fotka smazána.");
  }

  function setText(id: string, value: string) {
    setContent((c) => ({
      ...c,
      texts: { ...c.texts, [id]: value },
    }));
  }

  function setSlot(id: string, url: string) {
    setContent((c) => ({
      ...c,
      slots: { ...c.slots, [id]: url },
    }));
  }

  function pickUrl(url: string) {
    if (!pickerFor) return;
    if (pickerFor.kind === "slot") {
      setSlot(pickerFor.key, url);
    } else if (pickerFor.kind === "wedding-cover") {
      setContent((c) => ({
        ...c,
        weddings: {
          ...c.weddings,
          [pickerFor.key]: {
            ...c.weddings[pickerFor.key],
            cover: url,
          },
        },
      }));
    } else if (pickerFor.kind === "wedding-gallery") {
      setContent((c) => {
        const current = c.weddings[pickerFor.key]?.images ?? [];
        const base =
          current.length > 0
            ? current
            : baseWeddings.find((w) => w.slug === pickerFor.key)?.images ?? [];
        return {
          ...c,
          weddings: {
            ...c.weddings,
            [pickerFor.key]: {
              ...c.weddings[pickerFor.key],
              images: [...base, url],
            },
          },
        };
      });
    } else if (pickerFor.kind === "wreath") {
      setContent((c) => ({
        ...c,
        wreaths: {
          ...c.wreaths,
          [pickerFor.key]: {
            ...c.wreaths[pickerFor.key],
            image: url,
          },
        },
      }));
    }
    setPickerFor(null);
  }

  const textGroups = useMemo(() => {
    const groups: Record<string, typeof PAGE_TEXTS> = {};
    for (const t of PAGE_TEXTS) {
      // Wreath page copy lives under the Věnce tab, not in Texty
      if (t.id.startsWith("vence.")) continue;
      const prefix = t.id.split(".")[0] ?? "ostatní";
      const label =
        prefix === "home"
          ? "Úvod"
          : prefix === "svatby"
            ? "Svatby"
            : prefix === "kytky"
              ? "Kytky"
              : prefix === "workshopy"
                ? "Workshopy"
                : prefix === "o-mne"
                  ? "O mně"
                  : prefix === "kontakt"
                    ? "Kontakt"
                    : prefix;
      if (!groups[label]) groups[label] = [] as unknown as typeof PAGE_TEXTS;
      (groups[label] as unknown as (typeof PAGE_TEXTS)[number][]).push(t);
    }
    return groups;
  }, []);

  const baseWeddingSlugs = useMemo(
    () => new Set(baseWeddings.map((w) => w.slug)),
    [],
  );
  const baseWreathSlugs = useMemo(
    () => new Set(baseWreaths.map((w) => w.slug)),
    [],
  );

  const allWeddings = useMemo(() => {
    const customs = Object.entries(content.weddings ?? {})
      .filter(([slug, o]) => !baseWeddingSlugs.has(slug) && Boolean(o.title?.trim()))
      .map(([slug, o]) => ({
        slug,
        title: o.title!.trim(),
        place: o.place?.trim() || "",
        season: o.season?.trim() || "",
        summary: o.summary?.trim() || "",
        cover: o.cover?.trim() || WEDDING_PLACEHOLDER,
        images:
          o.images && o.images.length > 0
            ? o.images.filter(Boolean)
            : [o.cover?.trim() || WEDDING_PLACEHOLDER],
        custom: true as const,
      }));
    return [
      ...baseWeddings.map((w) => ({ ...w, custom: false as const })),
      ...customs,
    ];
  }, [content.weddings, baseWeddingSlugs]);

  const orderedWreaths = useMemo(() => {
    const customs = Object.entries(content.wreaths ?? {})
      .filter(([slug, o]) => !baseWreathSlugs.has(slug) && Boolean(o.name?.trim()))
      .map(([slug, o]) => ({
        slug,
        name: o.name!.trim(),
        description: o.description?.trim() || "",
        price: typeof o.price === "number" ? o.price : 0,
        size: o.size?.trim() || "Ø 33 cm",
        season: (o.season || "Jaro") as "Jaro" | "Podzim" | "Advent",
        available: typeof o.available === "boolean" ? o.available : true,
        image: o.image?.trim() || WREATH_PLACEHOLDER,
        custom: true as const,
      }));
    const merged = [
      ...baseWreaths.map((w) => ({ ...w, custom: false as const })),
      ...customs,
    ];
    const all = merged.map((w) => w.slug);
    const saved = (content.wreathOrder ?? []).filter((s) => all.includes(s));
    const order =
      saved.length === 0
        ? [
            ...merged.filter((w) => w.available).map((w) => w.slug),
            ...merged.filter((w) => !w.available).map((w) => w.slug),
          ]
        : [...saved, ...all.filter((s) => !saved.includes(s))];
    const bySlug = new Map(merged.map((w) => [w.slug, w]));
    return order
      .map((slug) => bySlug.get(slug))
      .filter((w): w is (typeof merged)[number] => Boolean(w));
  }, [content.wreathOrder, content.wreaths, baseWreathSlugs]);

  const workshopCards = useMemo(
    () =>
      Object.entries(content.workshops ?? {})
        .filter(([, o]) => Boolean(o.title?.trim()))
        .map(([slug, o]) => ({
          slug,
          title: o.title!.trim(),
          text: o.text?.trim() || "",
        })),
    [content.workshops],
  );

  const flowerCards = useMemo(
    () =>
      Object.entries(content.flowers ?? {})
        .filter(([, o]) => Boolean(o.title?.trim()))
        .map(([slug, o]) => ({
          slug,
          title: o.title!.trim(),
          text: o.text?.trim() || "",
        })),
    [content.flowers],
  );

  function uniqueSlug(title: string, taken: Set<string>, fallback: string) {
    let slug = slugifyTitle(title, fallback);
    if (!taken.has(slug)) return slug;
    let n = 2;
    while (taken.has(`${slug}-${n}`)) n += 1;
    return `${slug}-${n}`;
  }

  function moveWreath(slug: string, direction: -1 | 1) {
    const slugs = orderedWreaths.map((w) => w.slug);
    const i = slugs.indexOf(slug);
    const j = i + direction;
    if (i < 0 || j < 0 || j >= slugs.length) return;
    const next = [...slugs];
    [next[i], next[j]] = [next[j]!, next[i]!];
    setContent((c) => ({ ...c, wreathOrder: next }));
  }

  function addWedding() {
    const title = window.prompt("Název svatby (např. Eva & Petr)");
    if (!title?.trim()) return;
    const taken = new Set([
      ...baseWeddingSlugs,
      ...Object.keys(content.weddings ?? {}),
    ]);
    const slug = uniqueSlug(title, taken, "svatba");
    setContent((c) => ({
      ...c,
      weddings: {
        ...c.weddings,
        [slug]: {
          custom: true,
          title: title.trim(),
          place: "",
          season: "",
          summary: "",
          cover: WEDDING_PLACEHOLDER,
          images: [WEDDING_PLACEHOLDER],
        },
      },
    }));
    setStatus(`Přidána svatba „${title.trim()}“. Nezapomeňte uložit.`);
    setTab("svatby");
  }

  function removeWedding(slug: string) {
    if (!confirm("Smazat tuto svatbu z webu?")) return;
    setContent((c) => {
      const next = { ...c.weddings };
      delete next[slug];
      return { ...c, weddings: next };
    });
    setStatus("Svatba odebrána. Uložte změny.");
  }

  function addWreath() {
    const name = window.prompt("Název věnce");
    if (!name?.trim()) return;
    const taken = new Set([
      ...baseWreathSlugs,
      ...Object.keys(content.wreaths ?? {}),
    ]);
    const slug = uniqueSlug(name, taken, "venec");
    setContent((c) => {
      const order = c.wreathOrder?.length
        ? c.wreathOrder
        : orderedWreaths.map((w) => w.slug);
      return {
        ...c,
        wreaths: {
          ...c.wreaths,
          [slug]: {
            custom: true,
            name: name.trim(),
            description: "",
            price: 990,
            size: "Ø 33 cm",
            season: "Jaro",
            available: true,
            image: WREATH_PLACEHOLDER,
          },
        },
        wreathOrder: [slug, ...order.filter((s) => s !== slug)],
      };
    });
    setStatus(`Přidán věnec „${name.trim()}“. Nezapomeňte uložit.`);
    setTab("vence");
  }

  function removeWreath(slug: string) {
    if (!confirm("Smazat tento věnec z webu?")) return;
    setContent((c) => {
      const next = { ...c.wreaths };
      delete next[slug];
      return {
        ...c,
        wreaths: next,
        wreathOrder: (c.wreathOrder ?? []).filter((s) => s !== slug),
      };
    });
    setStatus("Věnec odebrán. Uložte změny.");
  }

  function addWorkshop() {
    const title = window.prompt("Název workshopu / formátu");
    if (!title?.trim()) return;
    const taken = new Set(Object.keys(content.workshops ?? {}));
    const slug = uniqueSlug(title, taken, "workshop");
    setContent((c) => ({
      ...c,
      workshops: {
        ...c.workshops,
        [slug]: { custom: true, title: title.trim(), text: "" },
      },
    }));
    setStatus(`Přidán workshop „${title.trim()}“. Nezapomeňte uložit.`);
    setTab("workshopy");
  }

  function removeWorkshop(slug: string) {
    if (!confirm("Smazat tuto položku?")) return;
    setContent((c) => {
      const next = { ...c.workshops };
      delete next[slug];
      return { ...c, workshops: next };
    });
    setStatus("Položka odebrána. Uložte změny.");
  }

  function addFlower() {
    const title = window.prompt("Název služby / položky (kytky)");
    if (!title?.trim()) return;
    const taken = new Set(Object.keys(content.flowers ?? {}));
    const slug = uniqueSlug(title, taken, "kytky");
    setContent((c) => ({
      ...c,
      flowers: {
        ...c.flowers,
        [slug]: { custom: true, title: title.trim(), text: "" },
      },
    }));
    setStatus(`Přidána položka „${title.trim()}“. Nezapomeňte uložit.`);
    setTab("kytky");
  }

  function removeFlower(slug: string) {
    if (!confirm("Smazat tuto položku?")) return;
    setContent((c) => {
      const next = { ...c.flowers };
      delete next[slug];
      return { ...c, flowers: next };
    });
    setStatus("Položka odebrána. Uložte změny.");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              THE BLOOMS
            </p>
            <h1 className="font-display text-2xl text-moss-deep">Admin</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="px-3 py-2 text-xs tracking-[0.14em] uppercase text-muted-foreground transition-colors hover:bg-moss-deep hover:text-white"
            >
              Web
            </Link>
            <button
              type="button"
              onClick={logout}
              className="px-3 py-2 text-xs tracking-[0.14em] uppercase text-muted-foreground transition-colors hover:bg-moss-deep hover:text-white"
            >
              Odhlásit
            </button>
            <button
              type="button"
              onClick={addWreath}
              className="bg-moss-deep px-5 py-2.5 text-xs font-medium tracking-[0.16em] uppercase text-white transition-colors hover:bg-bloom-light"
            >
              Přidat věnec
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="bg-moss-deep px-5 py-2.5 text-xs font-medium tracking-[0.16em] uppercase text-white transition-colors hover:bg-bloom-light disabled:opacity-60"
            >
              {saving ? "Ukládám…" : "Uložit změny"}
            </button>
          </div>
        </div>
        {status ? (
          <p className="border-t border-border/40 bg-card/60 px-4 py-2 text-center text-sm text-muted-foreground sm:px-6">
            {status}
          </p>
        ) : null}
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <nav className="flex flex-wrap gap-2 border-b border-border pb-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "px-4 py-2 text-xs tracking-[0.14em] uppercase transition-colors",
                tab === t.id
                  ? "bg-moss-deep text-white hover:bg-bloom-light"
                  : "bg-muted text-muted-foreground hover:bg-moss-deep hover:text-white",
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "texty" ? (
          <div className="mt-8 space-y-12">
            {Object.entries(textGroups).map(([group, fields]) => (
              <section key={group}>
                <h2 className="font-display text-3xl text-moss-deep">{group}</h2>
                <div className="mt-6 space-y-6">
                  {fields.map((field) => {
                    const value =
                      content.texts[field.id] ?? field.defaultValue;
                    return (
                      <label key={field.id} className="block">
                        <span className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                          {field.label}
                        </span>
                        {field.multiline ? (
                          <textarea
                            value={value}
                            onChange={(e) => setText(field.id, e.target.value)}
                            rows={4}
                            className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm leading-relaxed outline-none focus:border-bloom"
                          />
                        ) : (
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => setText(field.id, e.target.value)}
                            className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-bloom"
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : null}

        {tab === "fotky" ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {PAGE_SLOTS.map((slot) => {
              const url = content.slots[slot.id] || "";
              return (
                <div
                  key={slot.id}
                  className="border border-border/70 bg-card/40 p-4"
                >
                  <p className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                    {slot.label}
                  </p>
                  <div className="relative mt-3 aspect-[4/3] overflow-hidden bg-stone">
                    {url ? (
                      <Image
                        src={url}
                        alt={slot.label}
                        fill
                        className="object-cover"
                        sizes="400px"
                        unoptimized={url.startsWith("/media/")}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        Výchozí fotka z webu
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setPickerFor({ kind: "slot", key: slot.id })
                      }
                      className="bg-moss-deep px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-white hover:bg-bloom-light"
                    >
                      Vybrat fotku
                    </button>
                    {url ? (
                      <button
                        type="button"
                        onClick={() => setSlot(slot.id, "")}
                        className="px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-muted-foreground transition-colors hover:bg-moss-deep hover:text-white"
                      >
                        Obnovit výchozí
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {tab === "svatby" ? (
          <div className="mt-8 space-y-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Upravte existující realizace nebo přidejte novou svatbu.
              </p>
              <button
                type="button"
                onClick={addWedding}
                className="bg-moss-deep px-4 py-2.5 text-[10px] tracking-[0.14em] uppercase text-white transition-colors hover:bg-bloom-light sm:text-xs"
              >
                + Přidat svatbu
              </button>
            </div>
            {allWeddings.map((w) => {
              const o = content.weddings[w.slug] ?? {};
              const images = o.images ?? w.images;
              const cover = o.cover || w.cover;
              return (
                <section
                  key={w.slug}
                  className="border border-border/70 p-4 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h2 className="font-display text-3xl text-moss-deep">
                      {o.title || w.title}
                    </h2>
                    {w.custom ? (
                      <button
                        type="button"
                        onClick={() => removeWedding(w.slug)}
                        className="px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-muted-foreground transition-colors hover:bg-moss-deep hover:text-white"
                      >
                        Smazat
                      </button>
                    ) : null}
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Název"
                      value={o.title ?? w.title}
                      onChange={(v) =>
                        setContent((c) => ({
                          ...c,
                          weddings: {
                            ...c.weddings,
                            [w.slug]: { ...c.weddings[w.slug], title: v },
                          },
                        }))
                      }
                    />
                    <Field
                      label="Místo"
                      value={o.place ?? w.place}
                      onChange={(v) =>
                        setContent((c) => ({
                          ...c,
                          weddings: {
                            ...c.weddings,
                            [w.slug]: { ...c.weddings[w.slug], place: v },
                          },
                        }))
                      }
                    />
                    <Field
                      label="Sezóna"
                      value={o.season ?? w.season}
                      onChange={(v) =>
                        setContent((c) => ({
                          ...c,
                          weddings: {
                            ...c.weddings,
                            [w.slug]: { ...c.weddings[w.slug], season: v },
                          },
                        }))
                      }
                    />
                  </div>
                  <label className="mt-4 block">
                    <span className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                      Popis
                    </span>
                    <textarea
                      rows={3}
                      value={o.summary ?? w.summary}
                      onChange={(e) =>
                        setContent((c) => ({
                          ...c,
                          weddings: {
                            ...c.weddings,
                            [w.slug]: {
                              ...c.weddings[w.slug],
                              summary: e.target.value,
                            },
                          },
                        }))
                      }
                      className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-bloom"
                    />
                  </label>
                  <div className="mt-6">
                    <p className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                      Cover
                    </p>
                    <div className="relative mt-2 aspect-[16/10] max-w-md overflow-hidden bg-stone">
                      <Image
                        src={cover}
                        alt="Cover"
                        fill
                        className="object-cover"
                        sizes="400px"
                        unoptimized={cover.startsWith("/media/")}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPickerFor({
                          kind: "wedding-cover",
                          key: w.slug,
                        })
                      }
                      className="mt-3 bg-moss-deep px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-white hover:bg-bloom-light"
                    >
                      Změnit cover
                    </button>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                        Galerie
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setPickerFor({
                            kind: "wedding-gallery",
                            key: w.slug,
                          })
                        }
                        className="px-2 py-1 text-[10px] tracking-[0.14em] uppercase text-moss-deep transition-colors hover:bg-moss-deep hover:text-white"
                      >
                        + přidat fotku
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {images.map((src, i) => (
                        <div key={`${src}-${i}`} className="relative">
                          <div className="relative aspect-square overflow-hidden bg-stone">
                            <Image
                              src={src}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="160px"
                              unoptimized={src.startsWith("/media/")}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setContent((c) => ({
                                ...c,
                                weddings: {
                                  ...c.weddings,
                                  [w.slug]: {
                                    ...c.weddings[w.slug],
                                    images: images.filter((_, j) => j !== i),
                                  },
                                },
                              }))
                            }
                            className="mt-1 px-1 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-moss-deep hover:text-white"
                          >
                            Odebrat
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        ) : null}

        {tab === "vence" ? (
          <div className="mt-8 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Pořadí určuje, jak se věnce zobrazí na webu — nahoře =
                prodejnější. Šipkami posouvejte nahoru a dolů, pak uložte.
              </p>
              <button
                type="button"
                onClick={addWreath}
                className="bg-moss-deep px-4 py-2.5 text-[10px] tracking-[0.14em] uppercase text-white transition-colors hover:bg-bloom-light sm:text-xs"
              >
                + Přidat věnec
              </button>
            </div>
            <section className="border border-border/70 p-4 sm:p-6">
              <h2 className="font-display text-2xl text-moss-deep">
                Úvod stránky Věnce
              </h2>
              <label className="mt-4 block">
                <span className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                  Úvodní odstavec
                </span>
                <textarea
                  rows={4}
                  value={content.texts["vence.intro"] ?? defaultText("vence.intro")}
                  onChange={(e) => setText("vence.intro", e.target.value)}
                  className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm leading-relaxed outline-none focus:border-bloom"
                />
              </label>
            </section>
            {orderedWreaths.map((w, index) => {
              const o = content.wreaths[w.slug] ?? {};
              const image = o.image || w.image;
              const atTop = index === 0;
              const atBottom = index === orderedWreaths.length - 1;
              return (
                <section
                  key={w.slug}
                  className="grid gap-6 border border-border/70 p-4 sm:grid-cols-[160px_1fr] sm:p-6"
                >
                  <div>
                    <div className="relative aspect-square overflow-hidden bg-stone">
                      <Image
                        src={image}
                        alt={o.name || w.name}
                        fill
                        className="object-cover"
                        sizes="160px"
                        unoptimized={image.startsWith("/media/")}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPickerFor({ kind: "wreath", key: w.slug })
                      }
                      className="mt-3 w-full bg-moss-deep px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-white hover:bg-bloom-light"
                    >
                      Změnit fotku
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <p className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                        Pořadí {index + 1} / {orderedWreaths.length}
                        {w.custom ? " · nový" : ""}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={atTop}
                          onClick={() => moveWreath(w.slug, -1)}
                          className="border border-border px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-moss-deep transition-colors hover:border-moss-deep hover:bg-moss-deep hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Posunout nahoru"
                        >
                          ↑ Nahoru
                        </button>
                        <button
                          type="button"
                          disabled={atBottom}
                          onClick={() => moveWreath(w.slug, 1)}
                          className="border border-border px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-moss-deep transition-colors hover:border-moss-deep hover:bg-moss-deep hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Posunout dolů"
                        >
                          ↓ Dolů
                        </button>
                        {w.custom ? (
                          <button
                            type="button"
                            onClick={() => removeWreath(w.slug)}
                            className="px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-muted-foreground transition-colors hover:bg-moss-deep hover:text-white"
                          >
                            Smazat
                          </button>
                        ) : null}
                      </div>
                    </div>
                    <Field
                      label="Název"
                      value={o.name ?? w.name}
                      onChange={(v) =>
                        setContent((c) => ({
                          ...c,
                          wreaths: {
                            ...c.wreaths,
                            [w.slug]: { ...c.wreaths[w.slug], name: v },
                          },
                        }))
                      }
                    />
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field
                        label="Cena (Kč)"
                        value={String(o.price ?? w.price)}
                        onChange={(v) =>
                          setContent((c) => ({
                            ...c,
                            wreaths: {
                              ...c.wreaths,
                              [w.slug]: {
                                ...c.wreaths[w.slug],
                                price: Number(v) || 0,
                              },
                            },
                          }))
                        }
                      />
                      <Field
                        label="Rozměr"
                        value={o.size ?? w.size}
                        onChange={(v) =>
                          setContent((c) => ({
                            ...c,
                            wreaths: {
                              ...c.wreaths,
                              [w.slug]: { ...c.wreaths[w.slug], size: v },
                            },
                          }))
                        }
                      />
                      <label className="block">
                        <span className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                          Sezóna
                        </span>
                        <select
                          value={o.season ?? w.season}
                          onChange={(e) =>
                            setContent((c) => ({
                              ...c,
                              wreaths: {
                                ...c.wreaths,
                                [w.slug]: {
                                  ...c.wreaths[w.slug],
                                  season: e.target.value as
                                    | "Jaro"
                                    | "Podzim"
                                    | "Advent",
                                },
                              },
                            }))
                          }
                          className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-bloom"
                        >
                          {["Jaro", "Podzim", "Advent"].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={o.available ?? w.available}
                        onChange={(e) =>
                          setContent((c) => ({
                            ...c,
                            wreaths: {
                              ...c.wreaths,
                              [w.slug]: {
                                ...c.wreaths[w.slug],
                                available: e.target.checked,
                              },
                            },
                          }))
                        }
                      />
                      Dostupné ke koupi
                    </label>
                    <label className="block">
                      <span className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                        Popis
                      </span>
                      <textarea
                        rows={3}
                        value={o.description ?? w.description}
                        onChange={(e) =>
                          setContent((c) => ({
                            ...c,
                            wreaths: {
                              ...c.wreaths,
                              [w.slug]: {
                                ...c.wreaths[w.slug],
                                description: e.target.value,
                              },
                            },
                          }))
                        }
                        className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-bloom"
                      />
                    </label>
                  </div>
                </section>
              );
            })}
          </div>
        ) : null}

        {tab === "workshopy" ? (
          <div className="mt-8 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-xl text-sm text-muted-foreground">
                Další formáty workshopů se zobrazí v sekci „Co spolu tvoříme“ na
                stránce Workshopy.
              </p>
              <button
                type="button"
                onClick={addWorkshop}
                className="bg-moss-deep px-4 py-2.5 text-[10px] tracking-[0.14em] uppercase text-white transition-colors hover:bg-bloom-light sm:text-xs"
              >
                + Přidat workshop
              </button>
            </div>
            {workshopCards.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Zatím žádné vlastní položky. Základní formáty zůstávají na webu.
              </p>
            ) : null}
            {workshopCards.map((item) => (
              <section
                key={item.slug}
                className="space-y-4 border border-border/70 p-4 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="font-display text-2xl text-moss-deep">
                    {item.title || "Nový workshop"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => removeWorkshop(item.slug)}
                    className="px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-muted-foreground transition-colors hover:bg-moss-deep hover:text-white"
                  >
                    Smazat
                  </button>
                </div>
                <Field
                  label="Název"
                  value={content.workshops[item.slug]?.title ?? ""}
                  onChange={(v) =>
                    setContent((c) => ({
                      ...c,
                      workshops: {
                        ...c.workshops,
                        [item.slug]: {
                          ...c.workshops[item.slug],
                          custom: true,
                          title: v,
                        },
                      },
                    }))
                  }
                />
                <label className="block">
                  <span className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                    Popis
                  </span>
                  <textarea
                    rows={3}
                    value={content.workshops[item.slug]?.text ?? ""}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        workshops: {
                          ...c.workshops,
                          [item.slug]: {
                            ...c.workshops[item.slug],
                            custom: true,
                            text: e.target.value,
                          },
                        },
                      }))
                    }
                    className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-bloom"
                  />
                </label>
              </section>
            ))}
          </div>
        ) : null}

        {tab === "kytky" ? (
          <div className="mt-8 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-xl text-sm text-muted-foreground">
                Další služby se zobrazí v sekci „Co můžu připravit“ na stránce
                Kytky.
              </p>
              <button
                type="button"
                onClick={addFlower}
                className="bg-moss-deep px-4 py-2.5 text-[10px] tracking-[0.14em] uppercase text-white transition-colors hover:bg-bloom-light sm:text-xs"
              >
                + Přidat položku
              </button>
            </div>
            {flowerCards.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Zatím žádné vlastní položky. Základní služby zůstávají na webu.
              </p>
            ) : null}
            {flowerCards.map((item) => (
              <section
                key={item.slug}
                className="space-y-4 border border-border/70 p-4 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="font-display text-2xl text-moss-deep">
                    {item.title || "Nová položka"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => removeFlower(item.slug)}
                    className="px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-muted-foreground transition-colors hover:bg-moss-deep hover:text-white"
                  >
                    Smazat
                  </button>
                </div>
                <Field
                  label="Název"
                  value={content.flowers[item.slug]?.title ?? ""}
                  onChange={(v) =>
                    setContent((c) => ({
                      ...c,
                      flowers: {
                        ...c.flowers,
                        [item.slug]: {
                          ...c.flowers[item.slug],
                          custom: true,
                          title: v,
                        },
                      },
                    }))
                  }
                />
                <label className="block">
                  <span className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                    Popis
                  </span>
                  <textarea
                    rows={3}
                    value={content.flowers[item.slug]?.text ?? ""}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        flowers: {
                          ...c.flowers,
                          [item.slug]: {
                            ...c.flowers[item.slug],
                            custom: true,
                            text: e.target.value,
                          },
                        },
                      }))
                    }
                    className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-bloom"
                  />
                </label>
              </section>
            ))}
          </div>
        ) : null}

        {tab === "media" ? (
          <div className="mt-8">
            <label className="inline-flex cursor-pointer items-center bg-moss-deep px-5 py-3 text-xs tracking-[0.16em] uppercase text-white transition-colors hover:bg-bloom-light">
              {uploading ? "Nahrávám…" : "Nahrát fotku"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) await upload(file);
                }}
              />
            </label>
            <p className="mt-3 text-sm text-muted-foreground">
              JPG / PNG / WEBP / GIF, max 8&nbsp;MB. Po nahrání fotku přiřaďte ve
              fotkách stránek, svatbách nebo věncích.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {media.map((m) => (
                <div key={m.name} className="border border-border/60 p-2">
                  <div className="relative aspect-square overflow-hidden bg-stone">
                    <Image
                      src={m.url}
                      alt={m.name}
                      fill
                      className="object-cover"
                      sizes="200px"
                      unoptimized
                    />
                  </div>
                  <p className="mt-2 truncate text-[10px] text-muted-foreground">
                    {m.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeMedia(m.name)}
                    className="mt-1 px-1 py-0.5 text-[10px] tracking-[0.12em] uppercase text-muted-foreground transition-colors hover:bg-moss-deep hover:text-white"
                  >
                    Smazat
                  </button>
                </div>
              ))}
            </div>
            {media.length === 0 ? (
              <p className="mt-8 text-sm text-muted-foreground">
                Zatím žádné nahrané fotky.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {pickerFor ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="max-h-[85vh] w-full max-w-3xl overflow-auto bg-background p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-moss-deep">
                Vybrat fotku
              </h2>
              <button
                type="button"
                onClick={() => setPickerFor(null)}
                className="px-3 py-2 text-xs tracking-[0.14em] uppercase text-muted-foreground transition-colors hover:bg-moss-deep hover:text-white"
              >
                Zavřít
              </button>
            </div>
            <label className="mt-4 inline-flex cursor-pointer items-center border border-moss-deep/40 bg-transparent px-4 py-2 text-xs tracking-[0.14em] uppercase text-moss-deep transition-colors hover:border-moss-deep hover:bg-moss-deep hover:text-white">
              {uploading ? "Nahrávám…" : "Nahrát novou"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  const item = await upload(file);
                  if (item) pickUrl(item.url);
                }}
              />
            </label>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {media.map((m) => (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => pickUrl(m.url)}
                  className="group relative aspect-square overflow-hidden bg-stone"
                >
                  <Image
                    src={m.url}
                    alt={m.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="200px"
                    unoptimized
                  />
                </button>
              ))}
            </div>
            {media.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">
                Nejdřív nahrajte fotku.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-bloom"
      />
    </label>
  );
}
