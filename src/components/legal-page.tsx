import type { ReactNode } from "react";
import { FadeIn } from "@/components/fade-in";
import { JsonLd } from "@/components/json-ld";
import { legalNav } from "@/data/site";
import { breadcrumbJsonLd } from "@/lib/seo";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  path: string;
  children: ReactNode;
};

export function LegalPage({ title, description, path, children }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Úvod", path: "/" },
          { name: title, path },
        ])}
      />
      <FadeIn>
        <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
          Informace
        </p>
        <h1 className="mt-3 font-display text-5xl text-moss-deep sm:text-6xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </FadeIn>

      <FadeIn delay={60}>
        <div className="prose-legal mt-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <nav className="mt-16 border-t border-border pt-8" aria-label="Další informace">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs tracking-[0.14em] uppercase text-moss-deep transition-colors hover:text-bloom-light"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </FadeIn>
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
      <h2 className="font-display text-3xl text-moss-deep">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
