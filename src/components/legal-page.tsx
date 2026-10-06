import type { ReactNode } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { legalNav } from "@/data/site";
import { breadcrumbJsonLd } from "@/lib/seo";

type Props = {
  title: string;
  description: string;
  path: string;
  image: string;
  imageAlt?: string;
  children: ReactNode;
};

export function LegalPage({
  title,
  description,
  path,
  image,
  imageAlt,
  children,
}: Props) {
  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Úvod", path: "/" },
          { name: title, path },
        ])}
      />

      <PageHero
        title={title}
        image={image}
        imageAlt={imageAlt ?? title}
        eyebrow="Informace"
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <FadeIn>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        </FadeIn>

        <FadeIn delay={60}>
          <div className="prose-legal mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground sm:mt-12">
            {children}
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <nav
            className="mt-12 border-t border-border pt-6 sm:mt-16 sm:pt-8"
            aria-label="Další informace"
          >
            <ul className="flex flex-wrap gap-x-5 gap-y-2 sm:gap-x-6">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[10px] tracking-[0.14em] uppercase text-moss-deep transition-colors hover:text-bloom-light sm:text-xs"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </FadeIn>
      </div>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl text-moss-deep sm:text-3xl">
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
