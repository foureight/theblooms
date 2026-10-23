export type CmsWeddingOverride = {
  /** CMS-only entry (not in code defaults) */
  custom?: boolean;
  title?: string;
  place?: string;
  season?: string;
  summary?: string;
  cover?: string;
  images?: string[];
  /** Previous URL slugs after rename (for redirects) */
  aliases?: string[];
};

export type CmsWreathSizeOverride = {
  id: "s" | "m" | "l";
  label?: string;
  price?: number;
};

export type CmsWreathOverride = {
  /** CMS-only entry (not in code defaults) */
  custom?: boolean;
  name?: string;
  description?: string;
  price?: number;
  size?: string;
  /** Three customer-selectable sizes (S / M / L) */
  sizes?: CmsWreathSizeOverride[];
  season?: "Jaro" | "Podzim" | "Advent";
  available?: boolean;
  image?: string;
};

export type CmsDecorationVariantOverride = {
  /** CMS-only variant (not in code defaults) */
  custom?: boolean;
  /** Hide a built-in variant from the website */
  hidden?: boolean;
  name?: string;
  note?: string;
  image?: string;
};

export type CmsDecorationOverride = {
  /** CMS-only category (not in code defaults) */
  custom?: boolean;
  title?: string;
  description?: string;
  image?: string;
  variants?: Record<string, CmsDecorationVariantOverride>;
};

/** Extra workshop / flower service cards (CMS-only) */
export type CmsServiceItem = {
  custom?: boolean;
  title?: string;
  text?: string;
  image?: string;
};

/** Meta title + description for a public page (search / OG) */
export type CmsPageSeo = {
  title?: string;
  description?: string;
};

export type CmsPriceRow = {
  item: string;
  price: string;
};

export type FaqPageId =
  | "home"
  | "svatby"
  | "vence"
  | "advent"
  | "kytky"
  | "workshopy"
  | "o-mne"
  | "kontakt";

export type CmsFaqItem = {
  question: string;
  answer: string;
};

/** Editable wedding orientation price list (/svatby/cenik) */
export type CmsWeddingPriceList = {
  flowers?: CmsPriceRow[];
  decor?: CmsPriceRow[];
};

export type CmsContent = {
  /** Page photo URLs by slot id */
  slots: Record<string, string>;
  /** Page / section copy by text id */
  texts: Record<string, string>;
  /** SEO meta by page id (home, svatby, …) */
  pageSeo: Record<string, CmsPageSeo>;
  weddings: Record<string, CmsWeddingOverride>;
  wreaths: Record<string, CmsWreathOverride>;
  decorations: Record<string, CmsDecorationOverride>;
  /** Extra workshop format cards on /workshopy */
  workshops: Record<string, CmsServiceItem>;
  /** Extra service cards on /kytky */
  flowers: Record<string, CmsServiceItem>;
  /** Orientační ceník svatební floristiky */
  weddingPriceList: CmsWeddingPriceList;
  /** Pořadí věnců podle prodejnosti (slug → pozice) */
  wreathOrder: string[];
  /** Pořadí svatebních realizací */
  weddingOrder: string[];
  /** Pořadí vlastních položek na stránce Kytky */
  flowerOrder: string[];
  /** FAQ per page — when set, replaces code defaults for that page */
  faqs: Partial<Record<FaqPageId, CmsFaqItem[]>>;
};

export type MediaItem = {
  name: string;
  url: string;
  size: number;
  updatedAt: string;
};

export const emptyCms = (): CmsContent => ({
  slots: {},
  texts: {},
  pageSeo: {},
  weddings: {},
  wreaths: {},
  decorations: {},
  workshops: {},
  flowers: {},
  weddingPriceList: {},
  wreathOrder: [],
  weddingOrder: [],
  flowerOrder: [],
  faqs: {},
});

/**
 * Editable page SEO — defaults match current hardcoded metadata.
 * Each public page has its own row (no shared „Texty“ bucket).
 */
export const PAGE_SEO = [
  {
    id: "home",
    label: "Úvod",
    path: "/",
    defaultTitle: "THE BLOOMS — floristické studio pro svatby a věnce",
    defaultDescription:
      "THE BLOOMS — floristické studio Aleny Šmejkalové pro svatby, větší květinové realizace a sezónní věnce. Osobní práce v dílně, věnce koupíte online.",
  },
  {
    id: "svatby",
    label: "Svatby",
    path: "/svatby",
    defaultTitle: "Svatební floristika Praha — kytice a dekorace",
    defaultDescription:
      "Svatební floristika THE BLOOMS v Praze — celý květinový a dekorační koncept svatby od Aleny Šmejkalové. Kytice, obřad, hostina, instalace a vlastní inventář. Individuální poptávka.",
  },
  {
    id: "svatby-cenik",
    label: "Svatby — Ceník",
    path: "/svatby/cenik",
    defaultTitle: "Orientační ceník svatební floristiky",
    defaultDescription:
      "Orientační ceny svatební floristiky THE BLOOMS — kytice, korsáže, výzdoba obřadu a stolů, instalace a doprava. Minimální výchozí ceny, kalkulace na míru po konzultaci.",
  },
  {
    id: "vence",
    label: "Věnce",
    path: "/vence",
    defaultTitle: "Sezónní věnce — e-shop",
    defaultDescription:
      "Sezónní věnce THE BLOOMS — jarní, letní, podzimní i adventní. Fotografie, cena, rozměr a dostupnost. Kupte věnec online od floristky Aleny Šmejkalové.",
  },
  {
    id: "vence-advent",
    label: "Věnce — Advent",
    path: "/vence/advent",
    defaultTitle: "Adventní věnce — koupit online",
    defaultDescription:
      "Adventní věnce THE BLOOMS — koupit online od floristky Aleny Šmejkalové. Klasické i moderní adventní věnce s fotografií, cenou a dostupností. Doprava Zásilkovnou po Česku.",
  },
  {
    id: "workshopy",
    label: "Workshopy",
    path: "/workshopy",
    defaultTitle: "Květinové a věncové workshopy",
    defaultDescription:
      "Květinové a věncové workshopy THE BLOOMS — přijedu domů, do firmy nebo na akci. Přivezu květiny, materiál i nástroje. Domluvte workshop s Alenou Šmejkalovou.",
  },
  {
    id: "kytky",
    label: "Kytky",
    path: "/kytky",
    defaultTitle: "Kytky na míru",
    defaultDescription:
      "Floristické studio THE BLOOMS: větší a individuální květinové zakázky od 2 000 Kč. Květiny do domu, do firmy, aranžmá a výzdoba eventů — vždy na objednávku přes poptávku.",
  },
  {
    id: "o-mne",
    label: "O mně",
    path: "/o-mne",
    defaultTitle: "O mně — Alena Šmejkalová",
    defaultDescription:
      "Za floristickým studiem THE BLOOMS stojí Alena Šmejkalová. Svatby, větší květinové zakázky, věnce, eventy a workshopy — osobně, v dílně, bez klasického květinářství.",
  },
  {
    id: "kontakt",
    label: "Kontakt",
    path: "/kontakt",
    defaultTitle: "Kontakt a poptávka",
    defaultDescription:
      "Kontaktujte floristické studio THE BLOOMS — Alena Šmejkalová. Poptávka svatby, kytek, eventu nebo workshopu. E-mail theblooms@chtel.biz, telefon +420 775 125 224.",
  },
] as const;

export type PageSeoId = (typeof PAGE_SEO)[number]["id"];

export function defaultPageSeo(id: string): { title: string; description: string } {
  const row = PAGE_SEO.find((p) => p.id === id);
  return {
    title: row?.defaultTitle ?? "",
    description: row?.defaultDescription ?? "",
  };
}

/** URL-safe slug from Czech title */
export function slugifyTitle(input: string, fallback = "polozka"): string {
  const base = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return base || fallback;
}

/** Unique slug; appends -2, -3… on collision. */
export function uniqueSlugFromTitle(
  title: string,
  taken: Set<string>,
  fallback = "polozka",
) {
  const slug = slugifyTitle(title, fallback);
  if (!taken.has(slug)) return slug;
  let n = 2;
  while (taken.has(`${slug}-${n}`)) n += 1;
  return `${slug}-${n}`;
}

/**
 * Move CMS overrides keyed by legacy couple-name slugs onto canonical
 * wedding-name slugs (e.g. lea-a-martin → statek-u-lesa).
 */
export function migrateBaseWeddingCmsKeys(
  content: CmsContent,
  catalog: { slug: string; aliases?: string[] }[],
): CmsContent {
  const weddings: Record<string, CmsWeddingOverride> = { ...content.weddings };
  let weddingOrder = [...(content.weddingOrder ?? [])];
  let changed = false;

  for (const w of catalog) {
    for (const alias of w.aliases ?? []) {
      const legacy = weddings[alias];
      if (!legacy) continue;
      const existing = weddings[w.slug];
      weddings[w.slug] = existing ? { ...legacy, ...existing } : { ...legacy };
      delete weddings[alias];
      weddingOrder = weddingOrder.map((s) => (s === alias ? w.slug : s));
      changed = true;
    }
  }

  return changed ? { ...content, weddings, weddingOrder } : content;
}

/**
 * Rename CMS-only wedding keys to match their titles (e.g. nova-svatba-1791… → zamecka-svatba).
 * Keeps old keys in `aliases` for redirects. Does not touch built-in catalog slugs.
 */
export function syncCustomWeddingSlugs(
  content: CmsContent,
  baseSlugs: Set<string>,
): CmsContent {
  const weddings: Record<string, CmsWeddingOverride> = { ...content.weddings };
  let weddingOrder = [...(content.weddingOrder ?? [])];
  const taken = new Set<string>([...baseSlugs, ...Object.keys(weddings)]);

  for (const [oldSlug, o] of Object.entries(content.weddings ?? {})) {
    if (baseSlugs.has(oldSlug)) continue;
    // Skip legacy couple-name keys — migrateBaseWeddingCmsKeys handles those
    if (!o.custom && !o.title?.trim()) continue;
    const title = o.title?.trim();
    if (!title) continue;
    // Don't rename entries that are only legacy base aliases awaiting migration
    if (!o.custom && baseSlugs.has(oldSlug)) continue;

    taken.delete(oldSlug);
    const desired = uniqueSlugFromTitle(title, taken, "svatba");
    taken.add(desired);
    if (desired === oldSlug) continue;

    const aliases = [
      ...new Set([...(o.aliases ?? []), oldSlug]),
    ].filter((a) => a !== desired);

    delete weddings[oldSlug];
    weddings[desired] = { ...o, custom: true, aliases };
    weddingOrder = weddingOrder.map((s) => (s === oldSlug ? desired : s));
  }

  return { ...content, weddings, weddingOrder };
}

/** Named page photo slots */
export const PAGE_SLOTS = [
  { id: "home.hero", label: "Úvod — hero" },
  { id: "home.kytky", label: "Úvod — kytky" },
  { id: "home.vence", label: "Úvod — věnce" },
  { id: "home.workshopy", label: "Úvod — workshopy" },
  { id: "home.cta", label: "Úvod — závěrečná fotka" },
  { id: "svatby.hero", label: "Svatby — hero" },
  { id: "svatby.cenik", label: "Svatby — ceník (hero)" },
  { id: "kytky.hero", label: "Kytky — hero" },
  { id: "kytky.eventy", label: "Kytky — eventy" },
  { id: "kytky.gallery1", label: "Kytky — Větší kytice a aranžmá" },
  { id: "kytky.gallery2", label: "Kytky — Květiny do domu" },
  { id: "kytky.gallery3", label: "Kytky — Květiny do firmy" },
  { id: "kytky.gallery4", label: "Kytky — Pravidelná floristika" },
  { id: "kytky.gallery5", label: "Kytky — Speciální objednávky" },
  { id: "kytky.gallery6", label: "Kytky — Výzdoba eventů" },
  { id: "workshopy.hero", label: "Workshopy — hero" },
  { id: "workshopy.side", label: "Workshopy — boční fotka" },
  { id: "o-mne.portrait", label: "O mně — portrét" },
  { id: "legal.doprava", label: "Doprava a platba — hero" },
  { id: "legal.podminky", label: "Obchodní podmínky — hero" },
  { id: "legal.reklamace", label: "Reklamace — hero" },
  { id: "legal.osobni", label: "Ochrana osobních údajů — hero" },
] as const;

export type PageSlotId = (typeof PAGE_SLOTS)[number]["id"];

/** Editable texts — defaults live in code, overrides in CMS */
export const PAGE_TEXTS = [
  {
    id: "home.heroTitle",
    label: "Úvod — hlavní nadpis (H1)",
    multiline: true,
    defaultValue:
      "Floristické studio\npro svatby, květinové\nrealizace nebo věnce",
  },
  {
    id: "home.heroLead",
    label: "Úvod — podnadpis pod H1",
    multiline: true,
    defaultValue:
      "THE BLOOMS je studio Aleny Šmejkalové v Praze. Vznikají tu svatby a větší květinové realizace na míru a sezónní věnce, které koupíte přímo online. Osobní práce v dílně, od konceptu po hotový výsledek — pro páry i klienty, kteří chtějí květiny s charakterem a pečlivým detailem.",
  },
  {
    id: "home.twoWaysTitle",
    label: "Úvod — Dva způsoby, jak začít",
    multiline: false,
    defaultValue: "Dva způsoby, jak začít",
  },
  {
    id: "home.twoWaysWeddingsTitle",
    label: "Úvod — karta Svatby & kytky (nadpis)",
    multiline: false,
    defaultValue: "Svatby & kytky",
  },
  {
    id: "home.twoWaysWeddingsText",
    label: "Úvod — karta Svatby & kytky (text)",
    multiline: true,
    defaultValue:
      "Větší zakázky, eventy a realizace na míru — napíšete poptávku a domluvíme se společně.",
  },
  {
    id: "home.twoWaysWreathsTitle",
    label: "Úvod — karta Věnce (nadpis)",
    multiline: false,
    defaultValue: "Věnce",
  },
  {
    id: "home.twoWaysWreathsText",
    label: "Úvod — karta Věnce (text)",
    multiline: true,
    defaultValue:
      "Nabídka sezónních věnců — vyberete, přidáte do košíku a koupíte přímo na webu.",
  },
  {
    id: "home.flowersTitle",
    label: "Úvod — Květiny na míru (nadpis)",
    multiline: false,
    defaultValue: "Květiny na míru",
  },
  {
    id: "home.flowersText",
    label: "Úvod — Květiny na míru (text)",
    multiline: true,
    defaultValue:
      "Květiny do domu, do firmy, výzdoba eventů i individuální aranžmá. Každá zakázka vzniká podle vaší představy a konkrétní příležitosti, orientačně od 2 000 Kč. Stačí poslat poptávku a domluvíme se na všem ostatním.",
  },
  {
    id: "home.wreathsTitle",
    label: "Úvod — Sezónní věnce (nadpis)",
    multiline: false,
    defaultValue: "Sezónní věnce",
  },
  {
    id: "home.wreathsText",
    label: "Úvod — Sezónní věnce (text)",
    multiline: true,
    defaultValue:
      "Hotové věnce podle sezóny — s fotografií, cenou, rozměrem a dostupností. Vyberete a koupíte přímo na webu.",
  },
  {
    id: "home.workshopsTitle",
    label: "Úvod — Workshopy (nadpis)",
    multiline: false,
    defaultValue: "Přijedu za vámi",
  },
  {
    id: "home.workshopsText",
    label: "Úvod — Workshopy (text)",
    multiline: true,
    defaultValue:
      "Květinové a věncové workshopy domů, do firmy nebo na akci. Přivezu květiny, materiál i nástroje — vy zajistíte místo a lidi.",
  },
  {
    id: "home.ctaTitle",
    label: "Úvod — citát vedle závěrečné fotky",
    multiline: false,
    defaultValue: "„Jo, přesně tohle chci.“",
  },
  {
    id: "home.ctaText",
    label: "Úvod — text pod citátem",
    multiline: true,
    defaultValue: "Podívejte se na realizace, nebo mi rovnou napište.",
  },
  {
    id: "svatby.intro",
    label: "Svatby — úvodní odstavec",
    multiline: true,
    defaultValue:
      "Navrhnu celý floristický a dekorační koncept — nebo vyjdu z vaší představy a zrealizuji ji. Nejen květiny: brány, stoly, instalace, vázy, svícny, textil a další dekorace z vlastního inventáře.",
  },
  {
    id: "kytky.intro",
    label: "Kytky — úvodní odstavec",
    multiline: true,
    defaultValue:
      "Nemám klasické květinářství, květiny tvořím vždy na objednávku a podle vaší představy. Věnuji se větším a individuálním zakázkám, orientačně od 2 000 Kč. Stačí mi napsat, pro jakou příležitost květiny hledáte, a společně něco vymyslíme.",
  },
  {
    id: "vence.intro",
    label: "Věnce — úvodní odstavec",
    multiline: true,
    defaultValue:
      "Nabídka se mění podle sezóny. Každý věnec má fotografii, cenu, rozměr a dostupnost — vyberete a koupíte přímo zde.",
  },
  {
    id: "workshopy.intro",
    label: "Workshopy — úvodní odstavec",
    multiline: true,
    defaultValue:
      "Nemám stálou dílnu otevřenou veřejnosti — workshopy dělám na míru a přijedu za vámi. Vy zajistíte místo a lidi, já přivezu květiny, materiál, nástroje i celý program. Domluvíme se na tématu, počtu účastníků a termínu.",
  },
  {
    id: "o-mne.p1",
    label: "O mně — odstavec 1",
    multiline: true,
    defaultValue:
      "Za THE BLOOMS stojím já — Alena Šmejkalová. Pracuji ve vlastní dílně — bez kamenné prodejny a bez klasického květinářství. Věnuji se především svatbám, větším květinovým zakázkám, eventům, věncům a workshopům.",
  },
  {
    id: "o-mne.p2",
    label: "O mně — odstavec 2",
    multiline: true,
    defaultValue:
      "Ráda skládám celý koncept: květiny, prostor, světlo a dekorace. Mám vlastní inventář a styl, který je spíš editorial a klidný než „okázale květinový“.",
  },
  {
    id: "o-mne.p3",
    label: "O mně — odstavec 3",
    multiline: true,
    defaultValue:
      "Květiny připravuji na objednávku a podle vaší představy. Hotové sezónní věnce najdete v e-shopu; zbytek domlouváme přes poptávku.",
  },
  {
    id: "kontakt.intro",
    label: "Kontakt — úvodní text",
    multiline: true,
    defaultValue:
      "Napište, čeho se poptávka týká. U svatby se rovnou ptám na datum, místo a základní představu — ať můžu odpovědět konkrétně. Studio THE BLOOMS řeší svatby, kytky, eventy i workshopy přes poptávku; věnce koupíte v e-shopu.",
  },
  {
    id: "kontakt.owner",
    label: "Kontakt — jméno (patička + kontakt)",
    multiline: false,
    defaultValue: "Alena Šmejkalová",
  },
  {
    id: "kontakt.email",
    label: "Kontakt — e-mail",
    multiline: false,
    defaultValue: "theblooms@chtel.biz",
  },
  {
    id: "kontakt.phone",
    label: "Kontakt — telefon",
    multiline: false,
    defaultValue: "+420 775 125 224",
  },
  {
    id: "kontakt.location",
    label: "Kontakt — lokalita",
    multiline: false,
    defaultValue: "Praha – Nusle",
  },
  {
    id: "kontakt.instagram",
    label: "Kontakt — Instagram (bez @)",
    multiline: false,
    defaultValue: "thebloomscz",
  },
] as const;

export type PageTextId = (typeof PAGE_TEXTS)[number]["id"];

export function defaultText(id: string): string {
  const row = PAGE_TEXTS.find((t) => t.id === id);
  return row?.defaultValue ?? "";
}
