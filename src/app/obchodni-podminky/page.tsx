import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Obchodní podmínky",
  description: `Obchodní podmínky e-shopu věnců a služeb floristického studia ${site.name} — ${site.owner}.`,
  alternates: { canonical: "/obchodni-podminky" },
};

export default function ObchodniPodminkyPage() {
  return (
    <LegalPage
      title="Obchodní podmínky"
      path="/obchodni-podminky"
      description={`Tyto podmínky upravují nákup sezónních věnců na webu ${site.name} a rámec poptávkových služeb (svatby, kytky, eventy, workshopy).`}
    >
      <LegalSection title="1. Provozovatel">
        <p>
          Provozovatelem webu a prodávajícím je {site.owner}, podnikající pod
          značkou {site.name}. Kontakt:{" "}
          <a href={`mailto:${site.email}`} className="text-moss-deep underline">
            {site.email}
          </a>
          , telefon {site.phone}.
        </p>
      </LegalSection>
      <LegalSection title="2. Co lze koupit online">
        <p>
          Přes e-shop se prodávají hotové sezónní věnce uvedené v katalogu.
          Svatby, individuální kytky, eventy a workshopy se objednávají poptávkou
          a řídí se individuální dohodou.
        </p>
      </LegalSection>
      <LegalSection title="3. Objednávka věnce">
        <p>
          Objednávka vzniká odesláním formuláře v košíku. Potvrzení přijde na
          e-mail. Ceny jsou v Kč včetně DPH, pokud u zboží není uvedeno jinak.
        </p>
      </LegalSection>
      <LegalSection title="4. Dodání a platba">
        <p>
          Způsoby dopravy a platby jsou popsány na stránce Doprava a platba.
          Termín odeslání závisí na dostupnosti konkrétního věnce.
        </p>
      </LegalSection>
      <LegalSection title="5. Odstoupení od smlouvy">
        <p>
          Spotřebitel může u zboží zakoupeného na dálku odstoupit od smlouvy do
          14 dnů od převzetí, pokud zboží nebylo upraveno na míru a je vráceno v
          původním stavu. U rychle se kazícího zboží a květin mohou platit
          zákonné výjimky — konkrétní postup je u reklamací.
        </p>
      </LegalSection>
      <LegalSection title="6. Závěrečná ustanovení">
        <p>
          Podmínky se řídí právním řádem České republiky. Aktuální znění je vždy
          na této stránce. Poslední aktualizace: říjen 2026.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
