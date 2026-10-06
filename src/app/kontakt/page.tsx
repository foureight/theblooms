import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry-form";
import { FadeIn } from "@/components/fade-in";
import { site, type InquiryType } from "@/data/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Poptávka svatby, kytek, eventu nebo workshopu — THE BLOOMS.",
};

type Props = {
  searchParams: Promise<{ typ?: string }>;
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
  const { typ } = await searchParams;
  const defaultType = parseType(typ);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <FadeIn>
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
            Domluvíme se
          </p>
          <h1 className="mt-3 font-display text-5xl text-moss-deep sm:text-6xl">
            Kontakt
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Napište, čeho se poptávka týká. U svatby se rovnou ptám na datum,
            místo a základní představu — ať můžu odpovědět konkrétně.
          </p>
          <dl className="mt-10 space-y-4 text-sm">
            <div>
              <dt className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
                E-mail
              </dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${site.email}`}
                  className="hover:underline"
                >
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
                Telefon
              </dt>
              <dd className="mt-1">
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="hover:underline"
                >
                  {site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
                Instagram
              </dt>
              <dd className="mt-1">
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  @theblooms
                </a>
              </dd>
            </div>
          </dl>
        </FadeIn>
        <FadeIn delay={80}>
          <div className="border border-border/70 bg-card/70 p-6 sm:p-8">
            <InquiryForm defaultType={defaultType} />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
