"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type DecorationItem = {
  title: string;
  image: string;
};

type Props = {
  items: DecorationItem[];
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
          <figure
            key={d.title}
            data-deco-card
            className="relative aspect-[3/4] w-[72vw] max-w-[280px] shrink-0 overflow-hidden sm:w-[42vw] lg:w-[22vw] lg:max-w-none"
          >
            <Image
              src={d.image}
              alt={d.title}
              fill
              className="object-cover"
              sizes="(max-width:768px) 72vw, (max-width:1024px) 42vw, 22vw"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-moss-deep/70 to-transparent p-4">
              <p className="text-sm tracking-wide text-white">{d.title}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2">
        <button
          type="button"
          aria-label="Předchozí dekorace"
          disabled={!canPrev}
          onClick={() => scrollByDir(-1)}
          className={cn(
            "inline-flex size-11 items-center justify-center border border-bloom-deep/30 text-moss-deep transition-colors",
            canPrev
              ? "hover:border-bloom-deep hover:bg-bloom/10"
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
            "inline-flex size-11 items-center justify-center border border-bloom-deep/30 text-moss-deep transition-colors",
            canNext
              ? "hover:border-bloom-deep hover:bg-bloom/10"
              : "cursor-default opacity-35",
          )}
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
