import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { CmsImage } from "@/components/cms-image";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { wreathFaqs } from "@/data/faqs";
import { site } from "@/data/site";
import {
  formatPrice,
  getWreathSizes,
  wreathMinPrice,
  wreathSizeRangeLabel,
  wreaths as baseWreaths,
} from "@/data/wreaths";
import { getCmsContent, mergeWreath } from "@/lib/cms/content";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  floristOrganization,
} from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return baseWreaths.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cms = await getCmsContent();
  const wreath = mergeWreath(cms, slug);
  if (!wreath) return { title: "Věnec" };
  const sizeLabel = wreathSizeRangeLabel(wreath);
  return {
    title: `${wreath.name} — od ${formatPrice(wreathMinPrice(wreath))}`,
    description: `${wreath.description} Sezóna: ${wreath.season}. Velikosti ${sizeLabel}.`,
    alternates: { canonical: `/vence/${wreath.slug}` },
    openGraph: {
      title: `${wreath.name} · ${site.name}`,
      description: wreath.description,
      type: "website",
      locale: "cs_CZ",
      images: [{ url: wreath.image }],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function WreathDetailPage({ params }: Props) {
  const { slug } = await params;
  const cms = await getCmsContent();
  const wreath = mergeWreath(cms, slug);
  if (!wreath) notFound();
  const sizes = getWreathSizes(wreath);
  const sizeLabel = wreathSizeRangeLabel(wreath);
  const minPrice = wreathMinPrice(wreath);

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Úvod", path: "/" },
      { name: "Věnce", path: "/vence" },
      { name: wreath.name, path: `/vence/${wreath.slug}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: wreath.name,
      description: wreath.description,
      image: [wreath.image],
      sku: wreath.slug,
      brand: { "@type": "Brand", name: site.name },
      category: `Sezónní věnec — ${wreath.season}`,
      size: sizeLabel,
      url: absoluteUrl(`/vence/${wreath.slug}`),
      manufacturer: floristOrganization(),
      offers: sizes.map((s) => ({
        "@type": "Offer",
        name: s.label,
        priceCurrency: "CZK",
        price: String(s.price),
        availability: wreath.available
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        url: absoluteUrl(`/vence/${wreath.slug}`),
        seller: floristOrganization(),
      })),
    },
    faqJsonLd(wreathFaqs),
  ];

  return (
    <>
    <div className="mx-auto max-w-7xl px-4 pt-14 pb-0 sm:px-6 lg:px-8">
      <JsonLd data={jsonLd} />
      <Link
        href="/vence"
        className="text-xs tracking-[0.16em] uppercase text-muted-foreground hover:text-foreground"
      >
        ← Všechny věnce
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[3/4] overflow-hidden bg-stone">
          <CmsImage
            src={wreath.image}
            alt={`${wreath.name} — ${wreath.season}, ${sizeLabel}`}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
            {wreath.season}
          </p>
          <h1 className="mt-2 font-display text-5xl text-moss-deep sm:text-6xl">
            {wreath.name}
          </h1>
          {sizes.length > 1 ? (
            <p className="mt-4 text-lg text-muted-foreground">
              od {formatPrice(minPrice)}
            </p>
          ) : null}
          <dl className="mt-8 space-y-3 border-y border-border py-6 text-sm">
            {sizeLabel ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">
                  {sizes.length > 1 ? "Velikosti" : "Rozměr"}
                </dt>
                <dd>{sizeLabel}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Dostupnost</dt>
              <dd>{wreath.available ? "4 dny" : "Momentálně nedostupné"}</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {wreath.description}
          </p>
          <div className="mt-8">
            <AddToCartButton wreath={wreath} />
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Výroba po obdržení objednávky do 4&nbsp;dnů + doprava
          </p>
        </div>
      </div>

    </div>
    <FaqSection faqs={wreathFaqs} />
    </>
  );
}
