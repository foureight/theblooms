import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { CtaLink } from "@/components/cta-link";
import { CmsImage } from "@/components/cms-image";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { weddings as baseWeddings } from "@/data/weddings";
import { site } from "@/data/site";
import { getCmsContent, mergeWedding, mergeWeddings } from "@/lib/cms/content";
import { mergeFaqs } from "@/lib/cms/faqs";
import {
  absoluteUrl,
  absoluteUrls,
  breadcrumbJsonLd,
  faqJsonLd,
  floristOrganization,
  ogImages,
} from "@/lib/seo";

/** Uniform photo height across wedding grids site-wide */
const WEDDING_PHOTO_ASPECT = "aspect-[4/5]";
const WEDDING_HERO =
  "relative h-[45svh] min-h-[280px] w-full overflow-hidden sm:h-[45svh]";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return baseWeddings.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cms = await getCmsContent();
  const wedding = mergeWedding(cms, slug);
  if (!wedding) return { title: "Svatba" };
  return {
    title: `${wedding.title} — svatební floristika`,
    description: wedding.summary,
    alternates: { canonical: `/svatby/${wedding.slug}` },
    openGraph: {
      title: `${wedding.title} · ${site.name}`,
      description: wedding.summary,
      type: "article",
      locale: "cs_CZ",
      images: ogImages(wedding.cover, wedding.title),
    },
    twitter: {
      card: "summary_large_image",
      title: `${wedding.title} · ${site.name}`,
      description: wedding.summary,
      images: [absoluteUrl(wedding.cover)],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function WeddingDetailPage({ params }: Props) {
  const { slug } = await params;
  const cms = await getCmsContent();
  const wedding = mergeWedding(cms, slug);
  if (!wedding) notFound();
  if (wedding.slug !== slug) {
    permanentRedirect(`/svatby/${wedding.slug}`);
  }
  const others = mergeWeddings(cms)
    .filter((w) => w.slug !== wedding.slug)
    .slice(0, 2);
  const faqs = mergeFaqs(cms, "svatby");

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Úvod", path: "/" },
      { name: "Svatby", path: "/svatby" },
      { name: wedding.title, path: `/svatby/${wedding.slug}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: wedding.title,
      description: wedding.summary,
      url: absoluteUrl(`/svatby/${wedding.slug}`),
      image: absoluteUrls(wedding.images),
      creator: floristOrganization(),
      about: {
        "@type": "Thing",
        name: "Svatební floristika",
      },
      contentLocation: wedding.place,
      keywords: ["svatba", wedding.season, "floristika", site.name].join(", "),
    },
    faqJsonLd(faqs),
  ];

  return (
    <div>
      <JsonLd data={jsonLd} />
      <div className={WEDDING_HERO}>
        <CmsImage
          src={wedding.cover}
          alt={`Svatební floristika ${wedding.title} — ${wedding.place}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-moss-deep/40" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8">
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/70 sm:text-xs">
            {[wedding.season, wedding.place].filter(Boolean).join(" · ")}
          </p>
          <h1 className="mt-2 font-display text-4xl text-white sm:text-6xl md:text-7xl">
            {wedding.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-12 pb-0 sm:px-6 lg:px-8">
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {wedding.summary}
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Ukázka realizace studia {site.name}. Podobný floristický a dekorační
          koncept domluvíme přes poptávku — podle vašeho data, místa a stylu.
        </p>
        <CtaLink href="/kontakt?typ=svatba" className="mt-8">
          Chci podobnou realizaci
        </CtaLink>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {wedding.images.map((src, i) => (
            <div key={`${src}-${i}`} className={`relative ${WEDDING_PHOTO_ASPECT} overflow-hidden`}>
              <CmsImage
                src={src}
                alt={`${wedding.title} — fotografie ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-3">
          <CtaLink href="/kontakt?typ=svatba">Poptat svatbu</CtaLink>
          <CtaLink href="/svatby/cenik" variant="ghost">
            Orientační ceník
          </CtaLink>
        </div>

        {others.length > 0 && (
          <section className="mt-28">
            <h2 className="font-display text-4xl text-moss-deep sm:text-5xl">
              Další svatby
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {others.map((w) => (
                <Link key={w.slug} href={`/svatby/${w.slug}`} className="group">
                  <div
                    className={`relative ${WEDDING_PHOTO_ASPECT} overflow-hidden`}
                  >
                    <CmsImage
                      src={w.cover}
                      alt={w.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 50vw"
                    />
                  </div>
                  <h3 className="mt-3 font-display text-2xl text-moss-deep sm:text-3xl">
                    {w.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <FaqSection faqs={faqs} />
    </div>
  );
}
