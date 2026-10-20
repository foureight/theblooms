import Image from "next/image";
import Link from "next/link";
import { weddings } from "@/data/weddings";
import { cn } from "@/lib/utils";

export const dynamic = "force-static";

/** Každá stránka webu = vlastní položka. Žádné společné „Texty“. */
const PAGE_NAV = [
  "Úvod",
  "Svatby",
  "Věnce",
  "Workshopy",
  "Kytky",
  "O mně",
  "Kontakt",
] as const;

const TOOL_NAV = ["Objednávky", "Média"] as const;

/**
 * Statický návrh adminu — stejné CSS / typografie / CTA jako web.
 * Není napojený na CMS, jen vizuální mock.
 */
export default function AdminNavrhPage() {
  const list = weddings.slice(0, 4);
  const selected = list[0]!;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 flex h-svh w-48 shrink-0 flex-col border-r border-border/60 sm:w-56">
        <div className="px-4 py-4 sm:px-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            THE BLOOMS
          </p>
          <p className="mt-1 font-display text-lg leading-snug text-moss-deep sm:text-xl">
            Alenka v říši divů
          </p>
          <p className="mt-0.5 text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
            Návrh · jen vizuál
          </p>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col px-3 pb-5 sm:px-4">
          <p className="mb-2 px-2 text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
            Stránky
          </p>
          <ul className="space-y-0.5">
            {PAGE_NAV.map((label) => (
              <li key={label}>
                <span
                  className={cn(
                    "block px-2 py-2 text-xs tracking-[0.14em] uppercase",
                    label === "Svatby"
                      ? "bg-moss-deep text-white"
                      : "text-muted-foreground transition-colors hover:bg-moss-deep hover:text-white",
                  )}
                >
                  {label}
                </span>
              </li>
            ))}
          </ul>

          <p className="mb-2 mt-6 px-2 text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
            Provoz
          </p>
          <ul className="space-y-0.5">
            {TOOL_NAV.map((label) => (
              <li key={label}>
                <span className="block px-2 py-2 text-xs tracking-[0.14em] uppercase text-muted-foreground transition-colors hover:bg-moss-deep hover:text-white">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-1 border-t border-border/60 pt-4">
            <Link
              href="/admin"
              className="block px-2 py-2 text-xs tracking-[0.14em] uppercase text-muted-foreground transition-colors hover:bg-moss-deep hover:text-white"
            >
              Současný admin
            </Link>
            <span className="block px-2 py-2 text-xs tracking-[0.14em] uppercase text-muted-foreground">
              Odhlásit
            </span>
          </div>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
          <div>
            <p className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
              Stránka
            </p>
            <h1 className="font-display text-2xl text-moss-deep sm:text-3xl">
              Svatby
            </h1>
          </div>
          <button
            type="button"
            className="bg-moss-deep px-5 py-2.5 text-xs font-medium tracking-[0.16em] uppercase text-white transition-colors hover:bg-bloom-light"
          >
            Uložit změny
          </button>
        </header>

        <div className="px-4 py-8 sm:px-6">
          <section className="max-w-2xl border-b border-border pb-10">
            <p className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
              SEO stránky
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Meta pro /svatby — title a popis ve výsledcích vyhledávání a při
              sdílení.
            </p>
            <div className="mt-5 space-y-5">
              <label className="block">
                <span className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                  Meta title
                </span>
                <input
                  readOnly
                  defaultValue="Svatební floristika Praha — kytice a dekorace"
                  className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-moss-deep"
                />
              </label>
              <label className="block">
                <span className="flex items-baseline justify-between gap-3 text-xs tracking-[0.14em] uppercase text-muted-foreground">
                  Meta popis
                  <span className="normal-case tracking-normal text-[11px]">
                    cca 150–160 znaků
                  </span>
                </span>
                <textarea
                  readOnly
                  rows={3}
                  defaultValue="Svatební floristika THE BLOOMS v Praze — celý květinový a dekorační koncept svatby od Aleny Šmejkalové. Kytice, obřad, hostina, instalace a vlastní inventář. Individuální poptávka."
                  className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-moss-deep"
                />
              </label>
            </div>
          </section>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <section>
              <p className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                Realizace
              </p>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Texty a fotky stránky Svatby jsou tady — ne v oddělených
                „Textech“. URL z názvu.
              </p>

              <ul className="mt-8 divide-y divide-border border-y border-border">
                {list.map((w, i) => {
                  const active = i === 0;
                  return (
                    <li
                      key={w.slug}
                      className={cn(
                        "flex gap-4 py-4 transition-colors",
                        active && "bg-accent/40",
                      )}
                    >
                      <div className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden sm:w-24">
                        <Image
                          src={w.cover}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      <div className="min-w-0 flex-1 self-center">
                        <p className="font-display text-xl text-moss-deep sm:text-2xl">
                          {w.title}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {w.place} · {w.season}
                        </p>
                        <p className="mt-1 text-[11px] tracking-[0.08em] text-muted-foreground">
                          /svatby/{w.slug}
                        </p>
                      </div>
                      {active ? (
                        <span
                          className="w-1 shrink-0 self-stretch bg-moss-deep"
                          aria-hidden
                        />
                      ) : null}
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                className="mt-6 border border-border px-4 py-2.5 text-[10px] tracking-[0.14em] uppercase text-moss-deep transition-colors hover:bg-moss-deep hover:text-white sm:text-xs"
              >
                + Nová svatba
              </button>
            </section>

            <section className="border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0">
              <p className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                Úprava
              </p>
              <h2 className="mt-1 font-display text-3xl text-moss-deep">
                {selected.title}
              </h2>

              <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={selected.cover}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              <button
                type="button"
                className="mt-3 bg-moss-deep px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-white hover:bg-bloom-light"
              >
                Změnit cover
              </button>

              <div className="mt-8 space-y-5">
                <label className="block">
                  <span className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                    Název
                  </span>
                  <input
                    readOnly
                    defaultValue={selected.title}
                    className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-moss-deep"
                  />
                </label>
                <label className="block">
                  <span className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                    Místo
                  </span>
                  <input
                    readOnly
                    defaultValue={selected.place}
                    className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-moss-deep"
                  />
                </label>
                <label className="block">
                  <span className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                    Sezóna
                  </span>
                  <input
                    readOnly
                    defaultValue={selected.season}
                    className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-moss-deep"
                  />
                </label>
                <label className="block">
                  <span className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                    Popis
                  </span>
                  <textarea
                    readOnly
                    rows={3}
                    defaultValue={selected.summary}
                    className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-moss-deep"
                  />
                </label>
                <p className="text-sm text-muted-foreground">
                  URL:{" "}
                  <span className="text-moss-deep">
                    /svatby/{selected.slug}
                  </span>
                </p>
              </div>

              <div className="mt-8">
                <p className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                  Galerie
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {selected.images.slice(0, 3).map((src) => (
                    <div
                      key={src}
                      className="relative aspect-[4/5] overflow-hidden"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-3 border border-border px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-moss-deep transition-colors hover:bg-moss-deep hover:text-white"
                >
                  + Přidat fotku
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
