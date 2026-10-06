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
          "bg-[#3d6ea8] text-white hover:bg-[#2f5a8c]",
        variant === "outline" &&
          "border border-[#3d6ea8]/40 text-[#3d6ea8] hover:border-[#3d6ea8] hover:bg-[#3d6ea8]/10",
        variant === "ghost" &&
          "text-[#3d6ea8] underline-offset-4 hover:underline",
        className,
      )}
    >
      {children}
    </Link>
  );
}
