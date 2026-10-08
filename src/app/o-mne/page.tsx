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
  slotFrom,
  textFrom,
} from "@/lib/cms/content";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  floristOrganization,
} from "@/lib/seo";

const pageDescription = `Za floristickým studiem ${site.name} stojí ${site.owner}. Svatby, větší květinové zakázky, věnce, eventy a workshopy — osobně, v dílně, bez klasického květinářství.`;

export const metadata: Metadata = {
  title: `O mně — ${site.owner}`,
  description: pageDescription,
  alternates: { canonical: "/o-mne" },
  openGraph: {
    title: `${site.owner} · ${site.name}`,
    description: pageDescription,
    type: "profile",
    locale: "cs_CZ",
  },
};

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
      description: pageDescription,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `O studiu ${site.name}`,
    url: absoluteUrl("/o-mne"),
    about: floristOrganization(),
    description: pageDescription,
  },
  faqJsonLd(aboutFaqs),
];

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const cms = await getCmsContent();
  const portrait = slotFrom(
    cms,
    "o-mne.portrait",
    "https://images.unsplash.com/photo-1591886960571-74d43ddc707f?w=1200&q=80",
  );

  return (
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
  );
}
