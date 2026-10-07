export type WreathSeason = "Jaro" | "Podzim" | "Advent";

export type Wreath = {
  slug: string;
  name: string;
  price: number;
  size: string;
  season: WreathSeason;
  available: boolean;
  description: string;
  image: string;
};

const PLACEHOLDER = "/wreaths/placeholder.svg";

/** Katalog: 7 jaro · 7 podzim · 15 advent */
export const wreaths: Wreath[] = [
  // —— Jaro (7) ——
  {
    slug: "jarni-bylinkovy",
    name: "Jarní bylinkový",
    price: 990,
    size: "Ø 30 cm",
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
    size: "Ø 32 cm",
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
    size: "Ø 32 cm",
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
    size: "Ø 28 cm",
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
    size: "Ø 34 cm",
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
    size: "Ø 35 cm",
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
    size: "Ø 36 cm",
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
    size: "Ø 36 cm",
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
    size: "Ø 38 cm",
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
    size: "Ø 34 cm",
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
    size: "Ø 36 cm",
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
    size: "Ø 35 cm",
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
    size: "Ø 37 cm",
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
    size: "Ø 34 cm",
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
    size: "Ø 38 cm",
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
    size: "Ø 36 cm",
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
    size: "Ø 32 cm",
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
    size: "Ø 35 cm",
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
    size: "Ø 35 cm",
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
    size: "Ø 36 cm",
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
    size: "Ø 36 cm",
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
    size: "Ø 34 cm",
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
    size: "Ø 40 cm",
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
    size: "Ø 28 cm",
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
    size: "Ø 35 cm",
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
    size: "Ø 35 cm",
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
    size: "Ø 36 cm",
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
    size: "Ø 38 cm",
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
    size: "Ø 30 cm",
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
