import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { JsonLd } from "@/components/json-ld";
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

      <div className="relative h-[45svh] min-h-[280px] overflow-hidden">
        <Image
          src={image}
          alt={imageAlt ?? title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-moss-deep/40" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <p className="text-xs tracking-[0.22em] uppercase text-white/70">
            Informace
          </p>
          <h1 className="mt-2 font-display text-6xl text-white sm:text-7xl">
            {title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        </FadeIn>

        <FadeIn delay={60}>
          <div className="prose-legal mt-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
            {children}
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <nav
            className="mt-16 border-t border-border pt-8"
            aria-label="Další informace"
          >
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
