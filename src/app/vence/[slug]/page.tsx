import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { CmsImage } from "@/components/cms-image";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/data/site";
import { formatPrice, wreaths as baseWreaths } from "@/data/wreaths";
import { getCmsContent, mergeWreath } from "@/lib/cms/content";
import {
  absoluteUrl,
  breadcrumbJsonLd,
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
  return {
    title: `${wreath.name} — ${formatPrice(wreath.price)}`,
    description: `${wreath.description} Sezóna: ${wreath.season}. Rozměr ${wreath.size}.`,
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
      size: wreath.size,
      url: absoluteUrl(`/vence/${wreath.slug}`),
      manufacturer: floristOrganization(),
      offers: {
        "@type": "Offer",
        priceCurrency: "CZK",
        price: String(wreath.price),
        availability: wreath.available
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        url: absoluteUrl(`/vence/${wreath.slug}`),
        seller: floristOrganization(),
      },
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={jsonLd} />
      <Link
        href="/vence"
        className="text-xs tracking-[0.16em] uppercase text-muted-foreground hover:text-foreground"
      >
        ← Všechny věnce
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden bg-stone">
          <CmsImage
            src={wreath.image}
            alt={`${wreath.name} — ${wreath.season}, ${wreath.size}`}
            fill
            priority
            className="object-cover"
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
          <p className="mt-4 text-2xl font-medium">{formatPrice(wreath.price)}</p>
          <dl className="mt-8 space-y-3 border-y border-border py-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Rozměr</dt>
              <dd>{wreath.size}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Dostupnost</dt>
              <dd>{wreath.available ? "Skladem" : "Momentálně nedostupné"}</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {wreath.description}
          </p>
          <div className="mt-8">
            <AddToCartButton wreath={wreath} />
          </div>
        </div>
      </div>
    </div>
  );
}
