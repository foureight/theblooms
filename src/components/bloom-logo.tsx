import { BloomFlowerMark } from "@/components/bloom-flower-mark";
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
 * Flower spins once every ~6.5s (stays brand green).
 */
export function BloomLogo({
  className,
  variant = "full",
  tone = "default",
  priority = false,
}: Props) {
  if (variant === "flower") {
    return (
      <BloomFlowerMark
        tone={tone}
        className={cn("h-auto w-auto", className)}
      />
    );
  }

  const wordmark =
    tone === "white"
      ? "/theblooms-wordmark-white.svg"
      : "/theblooms-wordmark.svg";

  return (
    <span
      className={cn(
        "relative inline-block max-w-full overflow-hidden leading-none",
        className,
      )}
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
        className="block h-full w-auto max-w-none"
      />
      <BloomFlowerMark
        tone={tone}
        className="pointer-events-none absolute top-[0.6%] left-[84.31%] h-[98.7%] w-auto"
      />
    </span>
  );
}
