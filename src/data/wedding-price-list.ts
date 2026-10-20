export type PriceRow = {
  item: string;
  price: string;
};

export const weddingFlowerPrices: PriceRow[] = [
  { item: "Svatební kytice", price: "od 1 600 Kč" },
  { item: "Házecí kytice", price: "od 700 Kč" },
  { item: "Kytice pro maminky a babičky", price: "od 450 Kč/ks" },
  { item: "Kytice pro svědkyni", price: "od 450 Kč" },
  { item: "Kytička pro družičku", price: "od 350 Kč" },
  { item: "Korsáž pro ženicha", price: "od 150 Kč" },
  { item: "Korsáž pro svědka a tatínky", price: "od 150 Kč/ks" },
];

export const weddingDecorPrices: PriceRow[] = [
  { item: "Výzdoba obřadní brány", price: "od 3 000 Kč" },
  { item: "Kompletní výzdoba stolu", price: "od 1 000 Kč/stůl" },
  { item: "Instalace výzdoby", price: "od 1 500 Kč" },
  { item: "Deinstalace výzdoby", price: "od 1 000 Kč" },
  { item: "Doprava", price: "15 Kč/km" },
];
