import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { site } from "@/data/site";
import { DELIVERY_OPTIONS } from "@/lib/checkout";
import { TIER_BOX, TIER_FEES } from "@/lib/shipping";
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
      description="Doprava přes Zásilkovnu na kamenné výdejní místo nebo na adresu a platba kartou u online nákupu věnců. Bez Z-BOXů."
    >
      <LegalSection title="1. Doprava — Zásilkovna">
        <p>
          Věnce z e-shopu posílám přes <strong>Zásilkovnu</strong> po celé
          České republice. V košíku zvolíte:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            {DELIVERY_OPTIONS.point.label} — kamenná pobočka (bez Z-BOXů)
          </li>
          <li>{DELIVERY_OPTIONS.home.label}</li>
        </ul>
        <p className="mt-3">
          Telefon je u dopravy Zásilkovnou <strong>povinný</strong>.
        </p>
      </LegalSection>
      <LegalSection title="2. Cena podle velikosti balíku">
        <p>
          Každý věnec balím zvlášť. Cena dopravy závisí na velikosti krabice a
          počtu balíků v objednávce (ne jen na jednom malém balíku).
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>
            {TIER_BOX.small.label} — od{" "}
            {formatPrice(TIER_FEES.point.small)} (výdejní místo) / od{" "}
            {formatPrice(TIER_FEES.home.small)} (na adresu)
          </li>
          <li>
            {TIER_BOX.medium.label} — od{" "}
            {formatPrice(TIER_FEES.point.medium)} /{" "}
            {formatPrice(TIER_FEES.home.medium)}
          </li>
          <li>
            {TIER_BOX.large.label} (cca 60 × 50 × 40 cm) — od{" "}
            {formatPrice(TIER_FEES.point.large)} /{" "}
            {formatPrice(TIER_FEES.home.large)}
          </li>
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          Orientační ceny do potvrzení oficiálního ceníku Zásilkovny (včetně
          případných nadrozměrů nad součet stran 150&nbsp;cm).
        </p>
      </LegalSection>
      <LegalSection title="3. Termíny">
        <p>
          Dostupnost je uvedena u každého věnce. Expedice obvykle probíhá do
          několika pracovních dnů od připsání platby, u adventních věnců podle
          sezónního kalendáře.
        </p>
      </LegalSection>
      <LegalSection title="4. Platba kartou">
        <p>
          Objednávky z e-shopu hradíte <strong>kartou online</strong> (platební
          brána Stripe). Bez úspěšné platby se věnec neodesílá. Svatby a
          individuální zakázky se platí dle domluvy mimo e-shop.
        </p>
      </LegalSection>
      <LegalSection title="5. Poškození při přepravě">
        <p>
          Při převzetí na Zásilkovně prosím zkontrolujte balík. Poškození ihned
          reklamujte u dopravce a napište nám na {site.email}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
