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
      "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=1600&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
    ],
  },
];

export function getWedding(slug: string) {
  return weddings.find((w) => w.slug === slug);
}

export const decorations = [
  {
    title: "Vázy a nádoby",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80",
  },
  {
    title: "Svícny a svíčky",
    image:
      "https://images.unsplash.com/photo-1602874801006-e0cb7e7e8f5a?w=1200&q=80",
  },
  {
    title: "Obřadní brány",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
  },
  {
    title: "Textil a textury",
    image:
      "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=1200&q=80",
  },
  {
    title: "Stolní aranžmá",
    image:
      "https://images.unsplash.com/photo-1478144592103-25e218a50043?w=1200&q=80",
  },
  {
    title: "Instalace v prostoru",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
  },
  {
    title: "Detaily a doplňky",
    image:
      "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=1200&q=80",
  },
  {
    title: "Sezónní prvky",
    image:
      "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?w=1200&q=80",
  },
  {
    title: "Květinové detaily",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80",
  },
];
