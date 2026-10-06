import Link from "next/link";
import { BloomLogo } from "@/components/bloom-logo";
import { nav, site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-bloom-pink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="inline-block rounded-sm bg-white px-3 py-2">
            <BloomLogo variant="full" className="h-8 w-auto" />
          </div>
          <p className="mt-4 font-name text-lg font-medium tracking-wide text-white">
            {site.owner}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/80">
            Floristické studio. Svatby, větší květinové zakázky, věnce a
            workshopy — osobně a na míru.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-white/65">
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
          <p className="text-xs tracking-[0.2em] uppercase text-white/65">
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
      <div className="border-t border-white/20 px-4 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {site.name}
      </div>
    </footer>
  );
}
