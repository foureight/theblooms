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
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-3 sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((d) => (
          <Link
            key={d.slug}
            href={`/svatby/dekorace/${d.slug}`}
            data-deco-card
            className="group relative aspect-[3/4] w-[78vw] max-w-[300px] shrink-0 snap-center overflow-hidden sm:w-[46vw] sm:snap-start lg:w-[min(22vw,260px)] lg:max-w-none"
          >
            <Image
              src={d.image}
              alt={d.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width:640px) 78vw, (max-width:1024px) 46vw, 22vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-moss-deep/80 via-moss-deep/35 to-transparent p-3 sm:p-4">
              <p className="text-sm tracking-wide text-white sm:text-base">
                {d.title}
              </p>
              <p className="mt-1 text-[10px] tracking-[0.14em] uppercase text-white/75 sm:text-[11px]">
                {d.variants.length} variant · vybrat
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 lg:mt-0">
        <button
          type="button"
          aria-label="Předchozí dekorace"
          disabled={!canPrev}
          onClick={() => scrollByDir(-1)}
          className={cn(
            "inline-flex size-11 items-center justify-center border border-bloom-deep/25 bg-background text-moss-deep transition-colors lg:absolute lg:top-1/2 lg:left-0 lg:z-10 lg:-translate-y-1/2 lg:bg-background/90 lg:shadow-sm lg:backdrop-blur-sm",
            canPrev
              ? "hover:border-bloom-light hover:text-bloom-light"
              : "cursor-default opacity-35",
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
            "inline-flex size-11 items-center justify-center border border-bloom-deep/25 bg-background text-moss-deep transition-colors lg:absolute lg:top-1/2 lg:right-0 lg:z-10 lg:-translate-y-1/2 lg:bg-background/90 lg:shadow-sm lg:backdrop-blur-sm",
            canNext
              ? "hover:border-bloom-light hover:text-bloom-light"
              : "cursor-default opacity-35",
          )}
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
