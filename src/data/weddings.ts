export type Wedding = {
  slug: string;
  title: string;
  place: string;
  season: string;
  cover: string;
  summary: string;
  images: string[];
};

export const weddings: Wedding[] = [
  {
    slug: "lea-a-martin",
    title: "Lea & Martin",
    place: "Statek u lesa",
    season: "Léto",
    cover:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
    summary:
      "Celý floristický koncept od obřadní brány po hostinu — měkké tóny, sezónní květiny a vlastní inventář dekorací.",
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=80",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1600&q=80",
      "https://images.unsplash.com/photo-1478144592103-25e218a50043?w=1600&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1600&q=80",
    ],
  },
  {
    slug: "anna-a-tomas",
    title: "Anna & Tomáš",
    place: "Zámek a zahrada",
    season: "Jaro",
    cover:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1600&q=80",
    summary:
      "Jarní instalace, svatební kytice a květiny na stoly v jemné paletě zeleně a pudrových tónů.",
    images: [
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1600&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&q=80",
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=1600&q=80",
    ],
  },
  {
    slug: "tereza-a-david",
    title: "Tereza & David",
    place: "Venkovská stodola",
    season: "Podzim",
    cover:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80",
    summary:
      "Podzimní textury, sušené prvky a větší květinové instalace pro obřad i hostinu.",
    images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80",
      "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?w=1600&q=80",
      "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1600&q=80",
      "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1600&q=80",
    ],
  },
  {
    slug: "klara-a-jan",
    title: "Klára & Jan",
    place: "Městský loft",
    season: "Zima",
    cover:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1600&q=80",
    summary:
      "Intimní zimní svatba s důrazem na svícny, textil a pečlivě sestavené aranžmá.",
    images: [
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1600&q=80",
      "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=1200&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
    ],
  },
];

export function getWedding(slug: string) {
  return weddings.find((w) => w.slug === slug);
}

export type DecorationVariant = {
  slug: string;
  name: string;
  image: string;
  note: string;
};

export type DecorationCategory = {
  slug: string;
  title: string;
  image: string;
  description: string;
  variants: DecorationVariant[];
};

export const decorations: DecorationCategory[] = [
  {
    slug: "vazy-a-nadoby",
    title: "Vázy a nádoby",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80",
    description:
      "Sklo, keramika i naturální nádoby pro stoly, buffet i volné instalace.",
    variants: [
      {
        slug: "vaza-vysoka-cira",
        name: "Vysoká čirá váza",
        image:
          "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80",
        note: "Na stolní aranžmá i buffet",
      },
      {
        slug: "vaza-nizka-kourova",
        name: "Nízká kouřová váza",
        image:
          "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=900&q=80",
        note: "Jemnější stolní výška",
      },
      {
        slug: "misa-keramicka",
        name: "Keramická mísa",
        image:
          "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=900&q=80",
        note: "Širší kompozice uprostřed stolu",
      },
      {
        slug: "lahve-sada",
        name: "Sada lahví",
        image:
          "https://images.unsplash.com/photo-1478144592103-25e218a50043?w=900&q=80",
        note: "Volná linie po stole",
      },
    ],
  },
  {
    slug: "svicny-a-svicky",
    title: "Svícny a svíčky",
    image:
      "https://images.unsplash.com/photo-1602874801006-e0cb7e7e8f5a?w=1200&q=80",
    description: "Světlo na stoly, obřad i večerní atmosféru hostiny.",
    variants: [
      {
        slug: "svicen-vysoky",
        name: "Vysoký svícen",
        image:
          "https://images.unsplash.com/photo-1602874801006-e0cb7e7e8f5a?w=900&q=80",
        note: "Dramatičtější linie stolu",
      },
      {
        slug: "svicen-nizky",
        name: "Nízký svícen",
        image:
          "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=900&q=80",
        note: "Intimní světlo u hostů",
      },
      {
        slug: "svicky-sloupove",
        name: "Sloupové svíčky",
        image:
          "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=900&q=80",
        note: "Skupiny na buffet i podlahu",
      },
      {
        slug: "lucerny",
        name: "Lucerny",
        image:
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80",
        note: "Venkovní cesty a obřad",
      },
    ],
  },
  {
    slug: "obradni-brany",
    title: "Obřadní brány",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
    description: "Konstrukce a pozadí pro obřad — od minimalu po plnější instalaci.",
    variants: [
      {
        slug: "brana-oblouk",
        name: "Oblouk",
        image:
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80",
        note: "Klasický obřadní tvar",
      },
      {
        slug: "brana-ctverec",
        name: "Čtvercový rám",
        image:
          "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80",
        note: "Modernější silueta",
      },
      {
        slug: "brana-asymetrie",
        name: "Asymetrická instalace",
        image:
          "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&q=80",
        note: "Volnější editorial look",
      },
    ],
  },
  {
    slug: "textil-a-textury",
    title: "Textil a textury",
    image:
      "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=1200&q=80",
    description: "Běhouny, ubrusy a látky, které doladí tón celé hostiny.",
    variants: [
      {
        slug: "behoun-len",
        name: "Lněný běhoun",
        image:
          "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=900&q=80",
        note: "Naturální základ stolu",
      },
      {
        slug: "ubrus-smetanovy",
        name: "Smetanový ubrus",
        image:
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80",
        note: "Čistý podklad pod květiny",
      },
      {
        slug: "gaza-pudrova",
        name: "Pudrová gáza",
        image:
          "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=900&q=80",
        note: "Vzdušné překrytí",
      },
    ],
  },
  {
    slug: "stolni-aranzma",
    title: "Stolní aranžmá",
    image:
      "https://images.unsplash.com/photo-1478144592103-25e218a50043?w=1200&q=80",
    description: "Kompozice na hostinu — od kompaktních po dlouhé linie.",
    variants: [
      {
        slug: "stol-kompakt",
        name: "Kompaktní střed",
        image:
          "https://images.unsplash.com/photo-1478144592103-25e218a50043?w=900&q=80",
        note: "Kulaté i obdélníkové stoly",
      },
      {
        slug: "stol-linie",
        name: "Dlouhá linie",
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80",
        note: "Průběžná výzdoba stolu",
      },
      {
        slug: "stol-budova",
        name: "Budova / buffet",
        image:
          "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&q=80",
        note: "Větší kusy na stojany",
      },
    ],
  },
  {
    slug: "instalace-v-prostoru",
    title: "Instalace v prostoru",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
    description: "Větší kusy do sálu, vstupů a fotokoutků.",
    variants: [
      {
        slug: "instalace-vstup",
        name: "Vstupní instalace",
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80",
        note: "První dojem pro hosty",
      },
      {
        slug: "instalace-roh",
        name: "Rohová kompozice",
        image:
          "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=900&q=80",
        note: "Doplnění prostoru sálu",
      },
      {
        slug: "instalace-foto",
        name: "Fotokoutek",
        image:
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=80",
        note: "Pozadí pro fotografie",
      },
    ],
  },
  {
    slug: "detaily-a-doplnky",
    title: "Detaily a doplňky",
    image:
      "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=1200&q=80",
    description: "Drobnosti, které drží celek pohromadě.",
    variants: [
      {
        slug: "jmenovky-drzaky",
        name: "Držáky jmenovek",
        image:
          "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=900&q=80",
        note: "Ke květinám na stole",
      },
      {
        slug: "podnosy",
        name: "Podnosy",
        image:
          "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80",
        note: "Pod svíčky i aranžmá",
      },
      {
        slug: "zrcadla",
        name: "Zrcadlové podložky",
        image:
          "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=900&q=80",
        note: "Odraz světla na stole",
      },
    ],
  },
  {
    slug: "sezonni-prvky",
    title: "Sezónní prvky",
    image:
      "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?w=1200&q=80",
    description: "Materiál podle ročního období — sušené, zelené i svěží.",
    variants: [
      {
        slug: "sezona-susene",
        name: "Sušené prvky",
        image:
          "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?w=900&q=80",
        note: "Podzim a zima",
      },
      {
        slug: "sezona-zelen",
        name: "Živá zeleň",
        image:
          "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=80",
        note: "Jaro a léto",
      },
      {
        slug: "sezona-ovocne",
        name: "Ovocné detaily",
        image:
          "https://images.unsplash.com/photo-1529636798458-92182e662485?w=900&q=80",
        note: "Sezónní akcenty",
      },
    ],
  },
  {
    slug: "kvetinove-detaily",
    title: "Květinové detaily",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80",
    description: "Menší květinové kusy k inventáři — doplnění stolů a cest.",
    variants: [
      {
        slug: "detail-boutonniere-styl",
        name: "Mini vázičky",
        image:
          "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&q=80",
        note: "Jednotlivá místa u hostů",
      },
      {
        slug: "detail-cesta",
        name: "Květiny na cestu",
        image:
          "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=900&q=80",
        note: "Alej k obřadu",
      },
      {
        slug: "detail-zaves",
        name: "Závěsné detaily",
        image:
          "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80",
        note: "Do konstrukce nebo stromů",
      },
    ],
  },
];

export function getDecoration(slug: string) {
  return decorations.find((d) => d.slug === slug);
}

export function getDecorationVariant(
  categorySlug: string,
  variantSlug: string,
) {
  const category = getDecoration(categorySlug);
  return category?.variants.find((v) => v.slug === variantSlug);
}
