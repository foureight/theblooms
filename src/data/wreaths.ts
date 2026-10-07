export type WreathSeason = "Jaro" | "Podzim" | "Advent";

export type WreathSizeId = "s" | "m" | "l";

export type WreathSizeOption = {
  id: WreathSizeId;
  label: string;
  price: number;
};

export type Wreath = {
  slug: string;
  name: string;
  /** Base / medium size price (katalog „od“) */
  price: number;
  /** Medium size label fallback */
  size: string;
  /** Up to 3 size options — if missing, defaults are derived from price */
  sizes?: WreathSizeOption[];
  season: WreathSeason;
  available: boolean;
  description: string;
  image: string;
};

export const WREATH_SIZE_IDS: WreathSizeId[] = ["s", "m", "l"];

export const DEFAULT_SIZE_LABELS: Record<WreathSizeId, string> = {
  s: "Ø 25 cm",
  m: "Ø 33 cm",
  l: "Ø 45 cm",
};

/** Three sizes from the medium (base) price. */
export function defaultWreathSizes(basePrice: number): WreathSizeOption[] {
  const mid = Math.max(0, Math.round(basePrice));
  return [
    {
      id: "s",
      label: DEFAULT_SIZE_LABELS.s,
      price: Math.max(390, mid - 200),
    },
    {
      id: "m",
      label: DEFAULT_SIZE_LABELS.m,
      price: mid,
    },
    {
      id: "l",
      label: DEFAULT_SIZE_LABELS.l,
      price: mid + 400,
    },
  ];
}

export function getWreathSizes(wreath: {
  price: number;
  size?: string;
  sizes?: Array<{ id: WreathSizeId; label?: string; price?: number }>;
}): WreathSizeOption[] {
  const defaults = defaultWreathSizes(wreath.price).map((s) =>
    s.id === "m" && wreath.size?.trim()
      ? { ...s, label: wreath.size.trim() }
      : s,
  );
  if (!wreath.sizes || wreath.sizes.length === 0) return defaults;
  const byId = new Map(wreath.sizes.map((s) => [s.id, s]));
  return WREATH_SIZE_IDS.map((id) => {
    const fallback = defaults.find((d) => d.id === id)!;
    const override = byId.get(id);
    if (!override) return fallback;
    return {
      id,
      label: override.label?.trim() || fallback.label,
      price:
        typeof override.price === "number" && Number.isFinite(override.price)
          ? override.price
          : fallback.price,
    };
  });
}

export function getWreathSize(
  wreath: Pick<Wreath, "price" | "size" | "sizes">,
  sizeId: WreathSizeId = "m",
) {
  return (
    getWreathSizes(wreath).find((s) => s.id === sizeId) ??
    getWreathSizes(wreath)[1]!
  );
}

export function wreathMinPrice(
  wreath: Pick<Wreath, "price" | "size" | "sizes">,
) {
  return Math.min(...getWreathSizes(wreath).map((s) => s.price));
}

export function wreathSizeRangeLabel(
  wreath: Pick<Wreath, "price" | "size" | "sizes">,
) {
  const sizes = getWreathSizes(wreath);
  if (sizes.length === 1) return sizes[0]!.label;
  const labels = sizes.map((s) => s.label.replace(/^Ø\s*/i, ""));
  return `Ø ${labels.join(" / ")}`;
}

const PLACEHOLDER = "/wreaths/placeholder.svg";

/** Katalog: 7 jaro · 7 podzim · 15 advent */
export const wreaths: Wreath[] = [
  // —— Jaro (7) ——
  {
    slug: "jarni-bylinkovy",
    name: "Jarní bylinkový",
    price: 990,
    size: "Ø 33 cm",
    season: "Jaro",
    available: false,
    description:
      "Lehký věnec z bylinek a sezónní zeleně. Svěží, zelený a osobní — na dveře i stůl.",
    image: PLACEHOLDER,
  },
  {
    slug: "jarni-pudrovy",
    name: "Jarní pudrový",
    price: 1190,
    size: "Ø 33 cm",
    season: "Jaro",
    available: false,
    description:
      "Jemné pudrové tóny a sušené prvky. Elegantní doplněk do interiéru i na jarní stůl.",
    image: PLACEHOLDER,
  },
  {
    slug: "jarni-louka",
    name: "Jarní louka",
    price: 1090,
    size: "Ø 33 cm",
    season: "Jaro",
    available: false,
    description:
      "Vzdušný věnec s jarními květinami a naturálními stonky. Volná, živá kompozice.",
    image: PLACEHOLDER,
  },
  {
    slug: "jarni-zeleny",
    name: "Jarní zelený",
    price: 890,
    size: "Ø 33 cm",
    season: "Jaro",
    available: false,
    description:
      "Čistá zeleň a jemné detaily. Minimalistický jarní věnec do bytu i na dveře.",
    image: PLACEHOLDER,
  },
  {
    slug: "jarni-pastelovy",
    name: "Jarní pastelový",
    price: 1290,
    size: "Ø 33 cm",
    season: "Jaro",
    available: false,
    description:
      "Pastelové tóny a měkké textury. Romantický věnec pro jarní sezónu.",
    image: PLACEHOLDER,
  },
  {
    slug: "jarni-rustikalni",
    name: "Jarní rustikální",
    price: 1190,
    size: "Ø 33 cm",
    season: "Jaro",
    available: false,
    description:
      "Přírodní větvičky, zeleň a sušené prvky. Rustikální jarní věnec s charakterem.",
    image: PLACEHOLDER,
  },
  {
    slug: "jarni-kvetinovy",
    name: "Jarní květinový",
    price: 1390,
    size: "Ø 33 cm",
    season: "Jaro",
    available: false,
    description:
      "Bohatší květinová kompozice pro jaro. Na dveře, stůl nebo jako dárek.",
    image: PLACEHOLDER,
  },

  // —— Podzim (7) ——
  {
    slug: "podzim-cervene-sisky",
    name: "Podzimní s šípkami",
    price: 1490,
    size: "Ø 33 cm",
    season: "Podzim",
    available: true,
    description:
      "Hustý buxusový věnec s červenými šípkami, šiškami a pudrovými listy. Teplý podzimní tón.",
    image: "/wreaths/podzim-cervene-sisky.jpg",
  },
  {
    slug: "podzim-mochyne",
    name: "Podzimní s mochyní",
    price: 1590,
    size: "Ø 33 cm",
    season: "Podzim",
    available: true,
    description:
      "Bohatý podzimní věnec s mochyní, jablíčky, šípkami, šiškami a sušenými růžemi.",
    image: "/wreaths/podzim-mochyne.jpg",
  },
  {
    slug: "podzim-mechovy",
    name: "Podzimní mechový",
    price: 1390,
    size: "Ø 33 cm",
    season: "Podzim",
    available: false,
    description:
      "Hlubší tóny, mech a sušené detaily. Teplý podzimní věnec s dlouhou výdrží.",
    image: PLACEHOLDER,
  },
  {
    slug: "podzim-oranzovy",
    name: "Podzimní oranžový",
    price: 1490,
    size: "Ø 33 cm",
    season: "Podzim",
    available: false,
    description:
      "Oranžové a rezavé tóny, sušené plody a zeleň. Klasický podzim na dveře.",
    image: PLACEHOLDER,
  },
  {
    slug: "podzim-lesni",
    name: "Podzimní lesní",
    price: 1290,
    size: "Ø 33 cm",
    season: "Podzim",
    available: false,
    description:
      "Šišky, větvičky a naturální textury. Lesní podzimní věnec bez okázalosti.",
    image: PLACEHOLDER,
  },
  {
    slug: "podzim-burgundy",
    name: "Podzimní burgundy",
    price: 1590,
    size: "Ø 33 cm",
    season: "Podzim",
    available: false,
    description:
      "Hluboká bordo a pudrové tóny. Elegantní podzimní kompozice do interiéru.",
    image: PLACEHOLDER,
  },
  {
    slug: "podzim-skorice",
    name: "Podzimní skořicový",
    price: 1390,
    size: "Ø 33 cm",
    season: "Podzim",
    available: false,
    description:
      "Hřejivé hnědé a oranžové tóny, sušené prvky. Podzimní věnec s vůní sezóny.",
    image: PLACEHOLDER,
  },

  // —— Advent (15) ——
  {
    slug: "advent-pudrovy-masle",
    name: "Adventní pudrový s mašlí",
    price: 1690,
    size: "Ø 33 cm",
    season: "Advent",
    available: true,
    description:
      "Zeleň, pudrové tóny, šišky a dlouhá pudrová mašle. Slavnostní adventní věnec.",
    image: "/wreaths/advent-pudrovy-masle.jpg",
  },
  {
    slug: "advent-klasicky",
    name: "Adventní klasický",
    price: 1790,
    size: "Ø 33 cm",
    season: "Advent",
    available: false,
    description:
      "Tradiční adventní věnec se čtyřmi svícemi. Sezónní nabídka od listopadu.",
    image: PLACEHOLDER,
  },
  {
    slug: "advent-minimal",
    name: "Adventní minimal",
    price: 1490,
    size: "Ø 33 cm",
    season: "Advent",
    available: false,
    description:
      "Čistší, moderní adventní věnec s důrazem na zeleň a jednoduchý tvar.",
    image: PLACEHOLDER,
  },
  {
    slug: "advent-cerny",
    name: "Adventní tmavý",
    price: 1690,
    size: "Ø 33 cm",
    season: "Advent",
    available: false,
    description:
      "Hlubší tóny, šišky a střídmá dekorace. Adventní věnec s klidným charakterem.",
    image: PLACEHOLDER,
  },
  {
    slug: "advent-bily",
    name: "Adventní bílý",
    price: 1690,
    size: "Ø 33 cm",
    season: "Advent",
    available: false,
    description:
      "Bílé a krémové tóny, světlá zeleň. Světlý adventní věnec do moderního interiéru.",
    image: PLACEHOLDER,
  },
  {
    slug: "advent-zlaty",
    name: "Adventní zlatý",
    price: 1890,
    size: "Ø 33 cm",
    season: "Advent",
    available: false,
    description:
      "Jemné zlaté akcenty, šišky a zeleň. Slavnostní adventní věnec.",
    image: PLACEHOLDER,
  },
  {
    slug: "advent-cerveny",
    name: "Adventní červený",
    price: 1790,
    size: "Ø 33 cm",
    season: "Advent",
    available: false,
    description:
      "Červené bobule a klasické adventní detaily. Teplý a tradiční vzhled.",
    image: PLACEHOLDER,
  },
  {
    slug: "advent-natur",
    name: "Adventní natur",
    price: 1590,
    size: "Ø 33 cm",
    season: "Advent",
    available: false,
    description:
      "Přírodní materiály, šišky a sušené prvky. Advent bez lesku, s klidem.",
    image: PLACEHOLDER,
  },
  {
    slug: "advent-lux",
    name: "Adventní lux",
    price: 1990,
    size: "Ø 33 cm",
    season: "Advent",
    available: false,
    description:
      "Bohatší adventní kompozice většího průměru. Pro stůl nebo vstupní dveře.",
    image: PLACEHOLDER,
  },
  {
    slug: "advent-stolni",
    name: "Adventní stolní",
    price: 1390,
    size: "Ø 33 cm",
    season: "Advent",
    available: false,
    description:
      "Menší adventní věnec na stůl. Kompaktní, pečlivě sestavený.",
    image: PLACEHOLDER,
  },
  {
    slug: "advent-eukalyptus",
    name: "Adventní eukalyptus",
    price: 1690,
    size: "Ø 33 cm",
    season: "Advent",
    available: false,
    description:
      "Eukalyptus a zimní zeleň. Svěží adventní věnec s moderním nádechem.",
    image: PLACEHOLDER,
  },
  {
    slug: "advent-boruvkovy",
    name: "Adventní borůvkový tón",
    price: 1690,
    size: "Ø 33 cm",
    season: "Advent",
    available: false,
    description:
      "Modrofialové a pudrové akcenty v zeleni. Neobvyklý, ale klidný advent.",
    image: PLACEHOLDER,
  },
  {
    slug: "advent-venkovsky",
    name: "Adventní venkovský",
    price: 1590,
    size: "Ø 33 cm",
    season: "Advent",
    available: false,
    description:
      "Rustikální adventní věnec s přírodními detaily. Domácí a hřejivý.",
    image: PLACEHOLDER,
  },
  {
    slug: "advent-svicky-premium",
    name: "Adventní se svícemi premium",
    price: 2090,
    size: "Ø 33 cm",
    season: "Advent",
    available: false,
    description:
      "Kompletní adventní věnec se svícemi a bohatší dekorací. Sezónní highlight.",
    image: PLACEHOLDER,
  },
  {
    slug: "advent-jednoduchy",
    name: "Adventní jednoduchý",
    price: 1290,
    size: "Ø 33 cm",
    season: "Advent",
    available: false,
    description:
      "Střídmý adventní věnec bez zbytečností. Základní sezónní nabídka.",
    image: PLACEHOLDER,
  },
];

export function getWreath(slug: string) {
  return wreaths.find((w) => w.slug === slug);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(price);
}
