import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: "full" | "flower";
  /** White lockup for dark / colored backgrounds (footer). */
  tone?: "default" | "white";
  priority?: boolean;
};

/**
 * Official vector lockup — wordmark + flower.
 * Flower spins once every ~6.5s (≈5s pause, then a turn).
 */
export function BloomLogo({
  className,
  variant = "full",
  tone = "default",
  priority = false,
}: Props) {
  if (variant === "flower") {
    return (
      <Image
        src="/logo-flower.png"
        alt=""
        width={54}
        height={46}
        className={cn("h-auto w-auto", className)}
        aria-hidden
      />
    );
  }

  const wordmark =
    tone === "white"
      ? "/theblooms-wordmark-white.svg"
      : "/theblooms-wordmark.svg";
  const flower =
    tone === "white"
      ? "/theblooms-flower-white.svg"
      : "/theblooms-flower.svg";

  return (
    <span
      className={cn("relative inline-block leading-none", className)}
      style={{ aspectRatio: "553 / 85" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={wordmark}
        alt="THE BLOOMS"
        width={553}
        height={85}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className="block h-full w-auto"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={flower}
        alt=""
        width={84}
        height={84}
        decoding={priority ? "sync" : "async"}
        aria-hidden
        className="logo-flower-spin pointer-events-none absolute top-[0.6%] left-[84.31%] h-[98.7%] w-auto"
      />
    </span>
  );
}
