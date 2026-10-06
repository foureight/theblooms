export type Wreath = {
  slug: string;
  name: string;
  price: number;
  size: string;
  season: "Jaro" | "Léto" | "Podzim" | "Advent";
  available: boolean;
  description: string;
  image: string;
};

export const wreaths: Wreath[] = [
  {
    slug: "jarni-bylinkovy",
    name: "Jarní bylinkový věnec",
    price: 890,
    size: "Ø 30 cm",
    season: "Jaro",
    available: true,
    description:
      "Lehký věnec z bylinek a sezónních květin. Ideální na dveře nebo stůl — svěží, zelený a osobní.",
    image:
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1200&q=80",
  },
  {
    slug: "pudrovy-ruzovy",
    name: "Pudrový růžový věnec",
    price: 1190,
    size: "Ø 35 cm",
    season: "Jaro",
    available: true,
    description:
      "Jemné pudrové tóny a sušené prvky. Elegantní doplněk do interiéru i na jarní stůl.",
    image:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80",
  },
  {
    slug: "letni-louka",
    name: "Letní louka",
    price: 990,
    size: "Ø 32 cm",
    season: "Léto",
    available: true,
    description:
      "Vzdušný věnec s letními květinami a naturálními stonky. Volná, živá kompozice.",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80",
  },
  {
    slug: "podzimni-mechovy",
    name: "Podzimní mechový věnec",
    price: 1290,
    size: "Ø 36 cm",
    season: "Podzim",
    available: true,
    description:
      "Hlubší tóny, mech a sušené detaily. Teplý podzimní věnec s dlouhou výdrží.",
    image:
      "https://images.unsplash.com/photo-1478147251538-a3d440df566b?w=1200&q=80",
  },
  {
    slug: "adventni-klasicky",
    name: "Adventní klasický",
    price: 1490,
    size: "Ø 35 cm",
    season: "Advent",
    available: false,
    description:
      "Tradiční adventní věnec se čtyřmi svícemi. Sezónní nabídka — dostupný od listopadu.",
    image:
      "https://images.unsplash.com/photo-1512389142860-9c906e2f588e?w=1200&q=80",
  },
  {
    slug: "adventni-minimal",
    name: "Adventní minimal",
    price: 1390,
    size: "Ø 30 cm",
    season: "Advent",
    available: false,
    description:
      "Čistší, moderní adventní věnec s důrazem na zeleň a jednoduchý tvar.",
    image:
      "https://images.unsplash.com/photo-1576919228236-a097c6a17fcd?w=1200&q=80",
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
