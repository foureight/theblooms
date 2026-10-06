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
          "bg-moss-deep text-primary-foreground hover:bg-bloom-light",
        variant === "outline" &&
          "border border-moss-deep/40 text-moss-deep hover:border-bloom-light hover:bg-bloom-light/10 hover:text-bloom-light",
        variant === "ghost" &&
          "text-moss-deep underline-offset-4 hover:text-bloom-light hover:underline",
        className,
      )}
    >
      {children}
    </Link>
  );
}
