import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: "full" | "flower";
  priority?: boolean;
};

/** Official vector lockup from brand PDF */
export function BloomLogo({
  className,
  variant = "full",
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

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-full.svg?v=2"
      alt="THE BLOOMS"
      width={553}
      height={85}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={cn("h-auto w-auto", className)}
    />
  );
}
