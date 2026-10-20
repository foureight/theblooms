import type { Metadata } from "next";
import { CtaLink } from "@/components/cta-link";
import { CmsImage } from "@/components/cms-image";
import { FadeIn } from "@/components/fade-in";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { aboutFaqs } from "@/data/faqs";
import { site } from "@/data/site";
import {
  getCmsContent,
  seoFrom,
  slotFrom,
  textFrom,
} from "@/lib/cms/content";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  floristOrganization,
  ogImages,
} from "@/lib/seo";

const ABOUT_PORTRAIT_FALLBACK =
  "https://images.unsplash.com/photo-1591886960571-74d43ddc707f?w=1200&q=80";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getCmsContent();
  const seo = seoFrom(cms, "o-mne");
  const portrait = slotFrom(cms, "o-mne.portrait", ABOUT_PORTRAIT_FALLBACK);
  const images = ogImages(portrait, `${site.owner} · ${site.name}`);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/o-mne" },
    openGraph: {
      title: `${site.owner} · ${site.name}`,
      description: seo.description,
      type: "profile",
      locale: "cs_CZ",
      images,
    },
    twitter: {
      card: "summary_large_image",
      images: [absoluteUrl(portrait)],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const cms = await getCmsContent();
  const seo = seoFrom(cms, "o-mne");
  const portrait = slotFrom(cms, "o-mne.portrait", ABOUT_PORTRAIT_FALLBACK);
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Úvod", path: "/" },
      { name: "O mně", path: "/o-mne" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      name: `${site.owner} — ${site.name}`,
      url: absoluteUrl("/o-mne"),
      mainEntity: {
        "@type": "Person",
        name: site.owner,
        jobTitle: "Floristka",
        worksFor: floristOrganization(),
        url: absoluteUrl("/o-mne"),
        email: site.email,
        telephone: site.phone,
        sameAs: [site.instagram],
        description: seo.description,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: `O studiu ${site.name}`,
      url: absoluteUrl("/o-mne"),
      about: floristOrganization(),
      description: seo.description,
    },
    faqJsonLd(aboutFaqs),
  ];

  return (
    <>
    <div className="mx-auto max-w-7xl px-4 pt-14 pb-0 sm:px-6 lg:px-8">
      <JsonLd data={jsonLd} />
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <FadeIn>
          <div className="relative aspect-[3/4] overflow-hidden">
            <CmsImage
              src={portrait}
              alt={`Floristka ${site.owner} — studio ${site.name}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 40vw"
            />
          </div>
        </FadeIn>
        <FadeIn delay={80}>
          <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
            Osobně
          </p>
          <h1 className="mt-3 font-display text-5xl text-moss-deep sm:text-6xl md:text-7xl">
            {site.owner}
          </h1>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>{textFrom(cms, "o-mne.p1")}</p>
            <p>{textFrom(cms, "o-mne.p2")}</p>
            <p>{textFrom(cms, "o-mne.p3")}</p>
          </div>
          <CtaLink href="/kontakt" className="mt-10">
            Napsat mi
          </CtaLink>
        </FadeIn>
      </div>
    </div>
    <FaqSection faqs={aboutFaqs} />
    </>
  );
}
