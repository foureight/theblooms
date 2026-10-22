import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CmsImage } from "@/components/cms-image";
import { DecorationVariantPicker } from "@/components/decoration-variant-picker";
import { FadeIn } from "@/components/fade-in";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { weddingFaqs } from "@/data/faqs";
import { decorations as baseDecorations } from "@/data/weddings";
import { site } from "@/data/site";
import { getCmsContent, mergeDecoration } from "@/lib/cms/content";
import {
  absoluteUrl,
  absoluteUrls,
  breadcrumbJsonLd,
  faqJsonLd,
  ogImages,
} from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return baseDecorations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cms = await getCmsContent();
  const category = mergeDecoration(cms, slug);
  if (!category) return { title: "Dekorace" };
  return {
    title: `${category.title} — inventář dekorací`,
    description: category.description,
    alternates: { canonical: `/svatby/dekorace/${category.slug}` },
    openGraph: {
      title: `${category.title} · ${site.name}`,
      description: category.description,
      images: ogImages(category.image, category.title),
      locale: "cs_CZ",
    },
    twitter: {
      card: "summary_large_image",
      images: [absoluteUrl(category.image)],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function DecorationDetailPage({ params }: Props) {
  const { slug } = await params;
  const cms = await getCmsContent();
  const category = mergeDecoration(cms, slug);
  if (!category) notFound();

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Úvod", path: "/" },
      { name: "Svatby", path: "/svatby" },
      { name: "Dekorace", path: "/svatby#dekorace" },
      { name: category.title, path: `/svatby/dekorace/${category.slug}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: category.title,
      description: category.description,
      url: absoluteUrl(`/svatby/dekorace/${category.slug}`),
      isPartOf: { "@type": "WebPage", url: absoluteUrl("/svatby") },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: category.variants.map((v, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: v.name,
          image: absoluteUrls(v.image),
        })),
      },
    },
    faqJsonLd(weddingFaqs),
  ];

  return (
    <div>
      <JsonLd data={jsonLd} />
      <div className="relative h-[38svh] min-h-[220px] overflow-hidden sm:h-[45svh] sm:min-h-[280px]">
        <CmsImage
          src={category.image}
          alt={category.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-moss-deep/40" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8">
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/70 sm:text-xs">
            Inventář · Dekorace
          </p>
          <h1 className="mt-2 font-display text-4xl text-white sm:text-6xl md:text-7xl">
            {category.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-10 pb-0 sm:px-6 sm:pt-14 lg:px-8">
        <FadeIn>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {category.description}
          </p>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Kliknutím vyberte varianty, které chcete do poptávky svatby. Můžete
            zvolit více kusů najednou.
          </p>
        </FadeIn>
        <div className="mt-8 sm:mt-10">
          <DecorationVariantPicker category={category} />
        </div>
      </div>

      <FaqSection faqs={weddingFaqs} />
    </div>
  );
}
