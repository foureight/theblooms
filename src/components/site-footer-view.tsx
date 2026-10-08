"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BloomLogo } from "@/components/bloom-logo";
import { legalNav, nav } from "@/data/site";
import type { SiteContact } from "@/lib/cms/content";

export function SiteFooterView({ contact }: { contact: SiteContact }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-0 bg-moss-deep text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <BloomLogo tone="white" className="h-[2.4rem] w-auto" />
          <p className="mt-4 font-display text-lg text-white">
            {contact.owner}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/85">
            Floristické studio. Svatby, větší květinové zakázky, věnce a
            workshopy — osobně a na míru.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#ef7d61]">
            Menu
          </p>
          <ul className="mt-4 space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/90 transition-colors hover:text-bloom-light"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#ef7d61]">
            Informace
          </p>
          <ul className="mt-4 space-y-2">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/90 transition-colors hover:text-bloom-light"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#ef7d61]">
            Kontakt
          </p>
          <address className="mt-4 not-italic">
            <ul className="space-y-2 text-sm text-white/90">
              <li className="font-medium text-white">{contact.name}</li>
              <li>{contact.owner}</li>
              <li>{contact.location}</li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="transition-colors hover:text-bloom-light"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-bloom-light"
                >
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-bloom-light"
                >
                  @{contact.instagramHandle}
                </a>
              </li>
            </ul>
          </address>
        </div>
      </div>

      <div className="bg-white text-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:px-8">
          <p className="text-sm">
            © {new Date().getFullYear()} THE BLOOMS – {contact.owner}
          </p>
          <p className="text-xs text-muted-foreground sm:text-right">
            Design, programming a SEO / GEO{" "}
            <a
              href="https://forejt.net"
              target="_blank"
              rel="noreferrer"
              className="text-bloom-pink underline underline-offset-2 hover:text-bloom-light"
            >
              forejt.net
            </a>
            {", "}
            <a
              href="https://seo-radar.com"
              target="_blank"
              rel="noreferrer"
              className="text-bloom-pink underline underline-offset-2 hover:text-bloom-light"
            >
              seo-radar.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
