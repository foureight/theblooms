import Link from "next/link";
import { nav, site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-moss-deep text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-2xl tracking-[0.14em]">{site.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary-foreground/75">
            Floristické studio. Svatby, větší květinové zakázky, věnce a
            workshopy — osobně a na míru.
          </p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-primary-foreground/55">
            Menu
          </p>
          <ul className="mt-4 space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-primary-foreground/85 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-primary-foreground/55">
            Kontakt
          </p>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/85">
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
            <li>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">
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
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-primary-foreground/50">
        © {new Date().getFullYear()} {site.name}
      </div>
    </footer>
  );
}
