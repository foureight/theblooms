import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Doprava a platba",
  description: `Doprava a platba u sezónních věnců ${site.name}. Informace k odeslání a úhradě objednávky.`,
  alternates: { canonical: "/doprava-a-platba" },
};

export default function ShippingPage() {
  return (
    <LegalPage
      title="Doprava a platba"
      path="/doprava-a-platba"
      description="Přehled způsobů doručení a plateb u online nákupu sezónních věnců."
    >
      <LegalSection title="1. Doprava">
        <p>
          Věnce odesíláme po domluvě — osobní předání, rozvoz v dohodnuté oblasti
          nebo zaslání přepravní službou. Konkrétní možnost a cenu dopravy
          potvrdíme u objednávky podle místa a sezóny.
        </p>
      </LegalSection>
      <LegalSection title="2. Termíny">
        <p>
          Dostupnost je uvedena u každého věnce. Expedice obvykle probíhá do
          několika pracovních dnů od potvrzení objednávky, u adventních věnců
          podle sezónního kalendáře.
        </p>
      </LegalSection>
      <LegalSection title="3. Platba">
        <p>
          Standardně bankovní převod na základě potvrzení objednávky. Další
          platební metody mohou být doplněny později. Svatby a individuální
          zakázky se platí dle domluvy mimo e-shop.
        </p>
      </LegalSection>
      <LegalSection title="4. Poškození při přepravě">
        <p>
          Při převzetí prosím zkontrolujte balík. Poškození ihned reklamujte u
          dopravce a napište nám na {site.email}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
