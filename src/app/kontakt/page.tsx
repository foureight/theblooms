import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry-form";
import { FadeIn } from "@/components/fade-in";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { contactFaqs } from "@/data/faqs";
import { site, type InquiryType } from "@/data/site";
import {
  getCmsContent,
  mergeSiteContact,
  textFrom,
} from "@/lib/cms/content";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  floristOrganization,
} from "@/lib/seo";

const pageDescription = `Kontaktujte floristické studio ${site.name} — ${site.owner}. Poptávka svatby, kytek, eventu nebo workshopu. E-mail ${site.email}, telefon ${site.phone}.`;

export const metadata: Metadata = {
  title: "Kontakt a poptávka",
  description: pageDescription,
  alternates: { canonical: "/kontakt" },
  openGraph: {
    title: `Kontakt · ${site.name}`,
    description: pageDescription,
    type: "website",
    locale: "cs_CZ",
  },
};

const jsonLd = [
  breadcrumbJsonLd([
    { name: "Úvod", path: "/" },
    { name: "Kontakt", path: "/kontakt" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Kontakt ${site.name}`,
    url: absoluteUrl("/kontakt"),
    description: pageDescription,
    about: floristOrganization(),
    mainEntity: floristOrganization(),
  },
  faqJsonLd(contactFaqs),
];

type Props = {
  searchParams: Promise<{ typ?: string; dekorace?: string }>;
};

function parseType(raw?: string): InquiryType {
  const allowed: InquiryType[] = [
    "svatba",
    "kytky",
    "event",
    "workshop",
    "jine",
  ];
  if (raw && allowed.includes(raw as InquiryType)) return raw as InquiryType;
  return "svatba";
}

export default async function KontaktPage({ searchParams }: Props) {
  const { typ, dekorace } = await searchParams;
  const defaultType = parseType(typ);
  const defaultMessage = dekorace
    ? `Mám zájem o dekorace z inventáře — ${dekorace}.`
    : "";
  const cms = await getCmsContent();
  const contact = mergeSiteContact(cms);

  return (
    <>
    <div className="mx-auto w-full max-w-7xl px-4 pt-14 pb-0 sm:px-6 lg:px-8">
      <JsonLd data={jsonLd} />
      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <FadeIn>
          <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
            Domluvíme se
          </p>
          <h1 className="mt-3 font-display text-5xl text-moss-deep sm:text-6xl">
            Kontakt
          </h1>
          <p className="mt-3 font-display text-2xl text-moss-deep">
            {contact.owner}
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            {textFrom(cms, "kontakt.intro")}
          </p>
          <dl className="mt-10 space-y-4 text-sm">
            <div>
              <dt className="text-xs tracking-[0.16em] uppercase text-muted-foreground">
                E-mail
              </dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:underline"
                >
                  {contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.16em] uppercase text-muted-foreground">
                Telefon
              </dt>
              <dd className="mt-1">
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="hover:underline"
                >
                  {contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.16em] uppercase text-muted-foreground">
                Instagram
              </dt>
              <dd className="mt-1">
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  @{contact.instagramHandle}
                </a>
              </dd>
            </div>
          </dl>
        </FadeIn>
        <FadeIn delay={80}>
          <div className="border-t border-bloom/35 px-1 pt-8 sm:border-t-0 sm:border-l sm:border-bloom/35 sm:px-0 sm:pl-10 sm:pt-0">
            <InquiryForm
              defaultType={defaultType}
              defaultMessage={defaultMessage}
            />
          </div>
        </FadeIn>
      </div>
    </div>
    <FaqSection faqs={contactFaqs} />
    </>
  );
}
