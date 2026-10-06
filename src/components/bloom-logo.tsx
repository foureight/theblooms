import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: "full" | "wordmark" | "flower";
  priority?: boolean;
};

const assets = {
  full: { src: "/logo-full.png", alt: "THE BLOOMS", w: 900, h: 180 },
  wordmark: { src: "/logo-wordmark.png", alt: "THE BLOOMS", w: 700, h: 160 },
  flower: { src: "/logo-flower.png", alt: "", w: 400, h: 400 },
} as const;

export function BloomLogo({
  className,
  variant = "full",
  priority = false,
}: Props) {
  const asset = assets[variant];
  return (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.w}
      height={asset.h}
      priority={priority}
      className={cn("h-auto w-auto", className)}
    />
  );
}

/** Live wordmark in Acumin Pro Wide — ASCII only (safe for Typekit subset) */
export function BloomWordmarkLive({
  className,
  showMark = true,
  tone = "dark",
}: {
  className?: string;
  showMark?: boolean;
  tone?: "dark" | "light";
}) {
  return (
    <span className={cn("inline-flex items-center gap-3 sm:gap-4", className)}>
      <span className="inline-flex items-baseline gap-[0.3em] leading-none">
        <span
          className={cn(
            "font-brand translate-y-[-0.12em] text-[0.38em] font-normal tracking-[0.12em]",
            tone === "dark" ? "text-white" : "text-foreground",
          )}
        >
          THE
        </span>
        <span className="font-brand text-[1em] font-extrabold tracking-[-0.02em] text-bloom italic">
          BLOOMS
        </span>
      </span>
      {showMark ? (
        <Image
          src="/logo-flower.png"
          alt=""
          width={120}
          height={120}
          className="h-[0.95em] w-auto"
          aria-hidden
        />
      ) : null}
    </span>
  );
}
