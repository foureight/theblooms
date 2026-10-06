import Link from "next/link";
import { BloomLogo } from "@/components/bloom-logo";
import { nav, site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-bloom text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <BloomLogo tone="white" className="h-8 w-auto" />
          <p className="mt-4 font-name text-lg font-bold tracking-wide text-black">
            {site.owner}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/85">
            Floristické studio. Svatby, větší květinové zakázky, věnce a
            workshopy — osobně a na míru.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-white/70">
            Menu
          </p>
          <ul className="mt-4 space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/90 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-white/70">
            Kontakt
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/90">
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="hover:text-white"
              >
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                @{site.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white text-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:px-8">
          <p className="text-sm">
            © {new Date().getFullYear()} THE BLOOMS – {site.owner}
          </p>
          <p className="text-xs text-muted-foreground sm:text-right">
            Design, programming a SEO / GEO{" "}
            <a
              href="https://forejt.net"
              target="_blank"
              rel="noreferrer"
              className="text-bloom-pink underline underline-offset-2 hover:text-bloom-deep"
            >
              forejt.net
            </a>
            {", "}
            <a
              href="https://seo-radar.com"
              target="_blank"
              rel="noreferrer"
              className="text-bloom-pink underline underline-offset-2 hover:text-bloom-deep"
            >
              seo-radar.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
