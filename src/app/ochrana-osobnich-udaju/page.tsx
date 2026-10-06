import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Ochrana osobních údajů",
  description: `Zásady ochrany osobních údajů studia ${site.name}. Jak zpracováváme poptávky, objednávky a kontaktní údaje.`,
  alternates: { canonical: "/ochrana-osobnich-udaju" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Ochrana osobních údajů"
      path="/ochrana-osobnich-udaju"
      image="https://images.unsplash.com/photo-1487070183336-b863922373d4?w=1800&q=80"
      imageAlt="Detail květinového aranžmá"
      description={`Informace o tom, jak ${site.name} (${site.owner}) zpracovává osobní údaje návštěvníků a zákazníků.`}
    >
      <LegalSection title="1. Správce údajů">
        <p>
          Správcem je {site.owner}, značka {site.name}. Kontakt:{" "}
          <a href={`mailto:${site.email}`} className="text-moss-deep underline">
            {site.email}
          </a>
          .
        </p>
      </LegalSection>
      <LegalSection title="2. Jaké údaje zpracováváme">
        <p>
          Údaje z poptávkového formuláře a objednávky věnců: jméno, e-mail,
          telefon, zpráva, případně detaily svatby nebo doručení. Dále běžné
          technické údaje o návštěvě webu (IP, cookies v rozsahu nutném pro běh
          webu).
        </p>
      </LegalSection>
      <LegalSection title="3. Účel a právní základ">
        <p>
          Údaje zpracováváme kvůli vyřízení poptávky nebo smlouvy, plnění
          zákonných povinností a oprávněnému zájmu na komunikaci se zákazníkem.
          Marketingové zprávy zasíláme jen se souhlasem, pokud je vyžadován.
        </p>
      </LegalSection>
      <LegalSection title="4. Doba uchování">
        <p>
          Údaje uchováváme po dobu nutnou k vyřízení zakázky a po dobu
          stanovenou účetními a daňovými předpisy, případně do odvolání
          souhlasu.
        </p>
      </LegalSection>
      <LegalSection title="5. Vaše práva">
        <p>
          Máte právo na přístup, opravu, výmaz, omezení zpracování, přenositelnost
          a námitku. Podněty pište na {site.email}. Stížnost můžete podat u ÚOOÚ.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
