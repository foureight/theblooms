import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { site } from "@/data/site";
import { SHIPPING_FEE_CZK } from "@/lib/checkout";
import { formatPrice } from "@/data/wreaths";

export const metadata: Metadata = {
  title: "Doprava a platba",
  description: `Doprava Zásilkovnou a platba kartou u sezónních věnců ${site.name}.`,
  alternates: { canonical: "/doprava-a-platba" },
};

export default function ShippingPage() {
  return (
    <LegalPage
      title="Doprava a platba"
      path="/doprava-a-platba"
      image="https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1800&q=80"
      imageAlt="Sezónní věnec THE BLOOMS"
      description="Doprava přes Zásilkovnu na výdejní místo a platba kartou u online nákupu věnců."
    >
      <LegalSection title="1. Doprava — Zásilkovna">
        <p>
          Věnce z e-shopu posílám přes <strong>Zásilkovnu</strong> na vámi
          vybrané výdejní místo v České republice. Místo zvolíte v košíku před
          platbou. Cena dopravy je {formatPrice(SHIPPING_FEE_CZK)}.
        </p>
      </LegalSection>
      <LegalSection title="2. Termíny">
        <p>
          Dostupnost je uvedena u každého věnce. Expedice obvykle probíhá do
          několika pracovních dnů od připsání platby, u adventních věnců podle
          sezónního kalendáře.
        </p>
      </LegalSection>
      <LegalSection title="3. Platba kartou">
        <p>
          Objednávky z e-shopu hradíte <strong>kartou online</strong> (platební
          brána Stripe). Bez úspěšné platby se věnec neodesílá. Svatby a
          individuální zakázky se platí dle domluvy mimo e-shop.
        </p>
      </LegalSection>
      <LegalSection title="4. Poškození při přepravě">
        <p>
          Při převzetí na Zásilkovně prosím zkontrolujte balík. Poškození ihned
          reklamujte u dopravce a napište nám na {site.email}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
