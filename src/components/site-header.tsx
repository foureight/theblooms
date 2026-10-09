"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { BloomLogo } from "@/components/bloom-logo";
import { nav } from "@/data/site";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const pathname = usePathname();
  const { count, hydrated } = useCart();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="border-b border-border/60 bg-background/85 backdrop-blur-md xl:sticky xl:top-0 xl:z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="min-w-0 shrink"
          onClick={() => setOpen(false)}
          aria-label="THE BLOOMS — úvod"
        >
          <BloomLogo
            variant="full"
            priority
            className="h-[1.8rem] w-auto sm:h-[2.025rem]"
          />
        </Link>

        {/* Desktop nav only from xl — below that hamburger stays readable */}
        <nav className="hidden items-center gap-1 xl:flex">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 whitespace-nowrap px-3 py-2 text-xs font-bold tracking-[0.16em] uppercase underline-offset-4 transition-colors hover:text-bloom-light hover:underline",
                  active
                    ? "text-bloom underline"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <Link
            href="/kosik"
            aria-label="Košík"
            className="relative inline-flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-muted"
          >
            <ShoppingBag className="size-5" />
            {hydrated && count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-bloom text-[10px] text-white">
                {count}
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Zavřít menu" : "Otevřít menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background xl:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6 lg:px-8">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "border-b border-border/40 py-3.5 text-sm font-bold tracking-[0.16em] uppercase transition-colors",
                    active ? "text-bloom" : "text-moss-deep hover:text-bloom",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
