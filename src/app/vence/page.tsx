import type { Metadata } from "next";
import { FadeIn } from "@/components/fade-in";
import { WreathCatalog } from "@/components/wreath-catalog";

export const metadata: Metadata = {
  title: "Věnce",
  description:
    "Sezónní věnce THE BLOOMS — jarní, podzimní i adventní. Fotografie, cena, rozměr a nákup online.",
};

export default function VencePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <FadeIn>
        <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
          E-shop
        </p>
        <h1 className="mt-3 font-display text-6xl text-moss-deep sm:text-7xl">
          Věnce
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-lg">
          Nabídka se mění podle sezóny. Každý věnec má fotografii, cenu, rozměr
          a dostupnost — vyberete a koupíte přímo zde.
        </p>
      </FadeIn>
      <div className="mt-12">
        <WreathCatalog />
      </div>
    </div>
  );
}
