"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DecorationCategory } from "@/data/weddings";
import { cn } from "@/lib/utils";

type Props = {
  items: DecorationCategory[];
};

export function DecorationCarousel({ items }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows, items.length]);

  function scrollByDir(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-deco-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.7;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((d) => (
          <Link
            key={d.slug}
            href={`/svatby/dekorace/${d.slug}`}
            data-deco-card
            className="group relative aspect-[3/4] w-[72vw] max-w-[280px] shrink-0 overflow-hidden sm:w-[42vw] lg:w-[22vw] lg:max-w-none"
          >
            <Image
              src={d.image}
              alt={d.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width:768px) 72vw, (max-width:1024px) 42vw, 22vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-moss-deep/75 to-transparent p-4">
              <p className="text-sm tracking-wide text-white">{d.title}</p>
              <p className="mt-1 text-[11px] tracking-[0.14em] uppercase text-white/70">
                {d.variants.length} variant · vybrat
              </p>
            </div>
          </Link>
        ))}
      </div>

      <button
        type="button"
        aria-label="Předchozí dekorace"
        disabled={!canPrev}
        onClick={() => scrollByDir(-1)}
        className={cn(
          "absolute top-1/2 left-0 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center border border-bloom-deep/25 bg-background/90 text-moss-deep shadow-sm backdrop-blur-sm transition-colors",
          canPrev
            ? "hover:border-bloom-deep hover:bg-background"
            : "pointer-events-none opacity-0",
        )}
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Další dekorace"
        disabled={!canNext}
        onClick={() => scrollByDir(1)}
        className={cn(
          "absolute top-1/2 right-0 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center border border-bloom-deep/25 bg-background/90 text-moss-deep shadow-sm backdrop-blur-sm transition-colors",
          canNext
            ? "hover:border-bloom-deep hover:bg-background"
            : "pointer-events-none opacity-0",
        )}
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
