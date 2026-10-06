import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Reklamace",
  description: `Reklamační řád studia ${site.name} — jak řešit reklamaci věnce nebo služby.`,
  alternates: { canonical: "/reklamace" },
};

export default function ClaimsPage() {
  return (
    <LegalPage
      title="Reklamace"
      path="/reklamace"
      description="Postup při reklamaci zboží z e-shopu věnců a při výhradách ke službám na míru."
    >
      <LegalSection title="1. Reklamace věnce">
        <p>
          Vadné nebo poškozené zboží reklamujte bez zbytečného odkladu e-mailem
          na{" "}
          <a href={`mailto:${site.email}`} className="text-moss-deep underline">
            {site.email}
          </a>{" "}
          — uveďte číslo objednávky, popis vady a fotografie.
        </p>
      </LegalSection>
      <LegalSection title="2. Vyřízení">
        <p>
          Reklamaci potvrdíme a vyřídíme v zákonné lhůtě. Podle povahy vady
          nabídneme výměnu, slevu nebo vrácení kupní ceny.
        </p>
      </LegalSection>
      <LegalSection title="3. Služby na míru">
        <p>
          U svateb, kytek, eventů a workshopů platí individuální dohoda. Případné
          výhrady řešíme osobně — napište nebo zavolejte co nejdříve po akci.
        </p>
      </LegalSection>
      <LegalSection title="4. Spotřebitelský spor">
        <p>
          Spotřebitel může využít mimosoudní řešení sporů u České obchodní
          inspekce (www.coi.cz) nebo platformu ODR EU.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
