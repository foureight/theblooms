export type CmsWeddingOverride = {
  /** CMS-only entry (not in code defaults) */
  custom?: boolean;
  title?: string;
  place?: string;
  season?: string;
  summary?: string;
  cover?: string;
  images?: string[];
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

export type CmsDecorationOverride = {
  title?: string;
  description?: string;
  image?: string;
  variants?: Record<
    string,
    { name?: string; note?: string; image?: string }
  >;
};

/** Extra workshop / flower service cards (CMS-only) */
export type CmsServiceItem = {
  custom?: boolean;
  title?: string;
  text?: string;
  image?: string;
};

export type CmsContent = {
  /** Page photo URLs by slot id */
  slots: Record<string, string>;
  /** Page / section copy by text id */
  texts: Record<string, string>;
  weddings: Record<string, CmsWeddingOverride>;
  wreaths: Record<string, CmsWreathOverride>;
  decorations: Record<string, CmsDecorationOverride>;
  /** Extra workshop format cards on /workshopy */
  workshops: Record<string, CmsServiceItem>;
  /** Extra service cards on /kytky */
  flowers: Record<string, CmsServiceItem>;
  /** Pořadí věnců podle prodejnosti (slug → pozice) */
  wreathOrder: string[];
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
  weddings: {},
  wreaths: {},
  decorations: {},
  workshops: {},
  flowers: {},
  wreathOrder: [],
});

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

/** Named page photo slots */
export const PAGE_SLOTS = [
  { id: "home.hero", label: "Úvod — hero" },
  { id: "home.kytky", label: "Úvod — kytky" },
  { id: "home.vence", label: "Úvod — věnce" },
  { id: "home.workshopy", label: "Úvod — workshopy" },
  { id: "home.cta", label: "Úvod — závěrečná fotka" },
  { id: "svatby.hero", label: "Svatby — hero" },
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
      "Floristické studio\npro svatby,\nkvětinové realizace\nnebo věnce",
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
