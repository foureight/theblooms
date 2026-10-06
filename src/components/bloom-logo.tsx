import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: "full" | "wordmark" | "flower";
  priority?: boolean;
};

/** Official THE BLOOMS logo assets (from brand file) */
const assets = {
  full: { src: "/logo-full.png", alt: "THE BLOOMS", w: 300, h: 46 },
  wordmark: { src: "/logo-wordmark.png", alt: "THE BLOOMS", w: 246, h: 34 },
  flower: { src: "/logo-flower.png", alt: "", w: 54, h: 46 },
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
