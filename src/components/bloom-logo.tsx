import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Use wordmark only, flower only, or full combo */
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

/** Text wordmark fallback (Encode Sans Expanded ≈ Acumin Pro Wide) */
export function BloomWordmarkText({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-[0.28em] leading-none", className)}>
      <span className="font-name translate-y-[-0.08em] text-[0.42em] font-semibold tracking-[0.08em] text-foreground">
        THE
      </span>
      <span className="font-name text-[1em] font-bold tracking-[-0.03em] text-bloom italic">
        BLOOMS
      </span>
    </span>
  );
}
