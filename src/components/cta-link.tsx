import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
};

export function CtaLink({
  href,
  children,
  variant = "solid",
  className,
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center px-7 py-3.5 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300",
        variant === "solid" &&
          "bg-bloom-deep text-primary-foreground hover:bg-bloom",
        variant === "outline" &&
          "border border-bloom-deep/40 text-bloom-deep hover:border-bloom-deep hover:bg-bloom/10",
        variant === "ghost" &&
          "text-bloom-deep underline-offset-4 hover:underline",
        className,
      )}
    >
      {children}
    </Link>
  );
}
