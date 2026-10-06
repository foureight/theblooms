import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: "full" | "flower";
  /** White lockup for dark / colored backgrounds (footer). */
  tone?: "default" | "white";
  priority?: boolean;
};

/** Official vector lockup from brand PDF */
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

  if (tone === "white") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/theblooms-white.png"
        alt="THE BLOOMS"
        width={300}
        height={46}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn("h-auto w-auto", className)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/theblooms.svg"
      alt="THE BLOOMS"
      width={553}
      height={85}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={cn("h-auto w-auto", className)}
    />
  );
}
