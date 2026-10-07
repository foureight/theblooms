"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { weddings as baseWeddings } from "@/data/weddings";
import { wreaths as baseWreaths } from "@/data/wreaths";
import {
  PAGE_SLOTS,
  PAGE_TEXTS,
  type CmsContent,
  type MediaItem,
} from "@/lib/cms/types";
import { cn } from "@/lib/utils";

type Tab = "texty" | "fotky" | "svatby" | "vence" | "media";

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
      const prefix = t.id.split(".")[0] ?? "ostatní";
      const label =
        prefix === "home"
          ? "Úvod"
          : prefix === "svatby"
            ? "Svatby"
            : prefix === "kytky"
              ? "Kytky"
              : prefix === "vence"
                ? "Věnce"
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

  const orderedWreaths = useMemo(() => {
    const all = baseWreaths.map((w) => w.slug);
    const saved = (content.wreathOrder ?? []).filter((s) => all.includes(s));
    const order =
      saved.length === 0
        ? [
            ...baseWreaths.filter((w) => w.available).map((w) => w.slug),
            ...baseWreaths.filter((w) => !w.available).map((w) => w.slug),
          ]
        : [...saved, ...all.filter((s) => !saved.includes(s))];
    const bySlug = new Map(baseWreaths.map((w) => [w.slug, w]));
    return order
      .map((slug) => bySlug.get(slug))
      .filter((w): w is (typeof baseWreaths)[number] => Boolean(w));
  }, [content.wreathOrder]);

  function moveWreath(slug: string, direction: -1 | 1) {
    const slugs = orderedWreaths.map((w) => w.slug);
    const i = slugs.indexOf(slug);
    const j = i + direction;
    if (i < 0 || j < 0 || j >= slugs.length) return;
    const next = [...slugs];
    [next[i], next[j]] = [next[j]!, next[i]!];
    setContent((c) => ({ ...c, wreathOrder: next }));
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
              className="px-3 py-2 text-xs tracking-[0.14em] uppercase text-muted-foreground hover:text-bloom-light"
            >
              Web
            </Link>
            <button
              type="button"
              onClick={logout}
              className="px-3 py-2 text-xs tracking-[0.14em] uppercase text-muted-foreground hover:text-foreground"
            >
              Odhlásit
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="bg-moss-deep px-5 py-2.5 text-xs font-medium tracking-[0.16em] uppercase text-white hover:bg-bloom-light disabled:opacity-60"
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
                  ? "bg-moss-deep text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground",
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
                        className="px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-muted-foreground hover:text-foreground"
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
            {baseWeddings.map((w) => {
              const o = content.weddings[w.slug] ?? {};
              const images = o.images ?? w.images;
              const cover = o.cover || w.cover;
              return (
                <section
                  key={w.slug}
                  className="border border-border/70 p-4 sm:p-6"
                >
                  <h2 className="font-display text-3xl text-moss-deep">
                    {o.title || w.title}
                  </h2>
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
                        className="text-[10px] tracking-[0.14em] uppercase text-moss-deep hover:text-bloom-light"
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
                            className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
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
            <p className="text-sm text-muted-foreground">
              Pořadí určuje, jak se věnce zobrazí na webu — nahoře =
              prodejnější. Šipkami posouvejte nahoru a dolů, pak uložte.
            </p>
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
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={atTop}
                          onClick={() => moveWreath(w.slug, -1)}
                          className="border border-border px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-moss-deep hover:border-bloom-light hover:text-bloom-light disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Posunout nahoru"
                        >
                          ↑ Nahoru
                        </button>
                        <button
                          type="button"
                          disabled={atBottom}
                          onClick={() => moveWreath(w.slug, 1)}
                          className="border border-border px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-moss-deep hover:border-bloom-light hover:text-bloom-light disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Posunout dolů"
                        >
                          ↓ Dolů
                        </button>
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

        {tab === "media" ? (
          <div className="mt-8">
            <label className="inline-flex cursor-pointer items-center bg-moss-deep px-5 py-3 text-xs tracking-[0.16em] uppercase text-white hover:bg-bloom-light">
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
                    className="mt-1 text-[10px] tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground"
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
                className="text-xs tracking-[0.14em] uppercase text-muted-foreground"
              >
                Zavřít
              </button>
            </div>
            <label className="mt-4 inline-flex cursor-pointer items-center border border-bloom/40 px-4 py-2 text-xs tracking-[0.14em] uppercase text-moss-deep hover:border-bloom-light hover:text-bloom-light">
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
