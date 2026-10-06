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
        "inline-flex items-center justify-center px-6 py-3 text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-300",
        variant === "solid" &&
          "bg-moss-deep text-primary-foreground hover:bg-moss",
        variant === "outline" &&
          "border border-moss-deep/40 text-moss-deep hover:border-moss-deep hover:bg-moss-deep/5",
        variant === "ghost" &&
          "text-moss-deep underline-offset-4 hover:underline",
        className,
      )}
    >
      {children}
    </Link>
  );
}
