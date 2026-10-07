import { formatPrice, type Wreath } from "@/data/wreaths";
import { cn } from "@/lib/utils";

/** Split name after the first word so titles always read as two lines. */
function TwoLineName({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0] ?? name;
  const rest = parts.slice(1).join(" ");

  return (
    <>
      {first}
      {rest ? (
        <>
          <br />
          {rest}
        </>
      ) : null}
    </>
  );
}

type Props = {
  wreath: Pick<Wreath, "name" | "season" | "size" | "price">;
  className?: string;
  titleClassName?: string;
  priceClassName?: string;
};

/** Name (2 lines) → season · size → price on the right. */
export function WreathCardCaption({
  wreath,
  className,
  titleClassName,
  priceClassName,
}: Props) {
  return (
    <div className={cn("mt-4 flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <h3
          className={cn(
            "font-display text-2xl leading-[1.15] text-moss-deep sm:text-3xl",
            titleClassName,
          )}
        >
          <TwoLineName name={wreath.name} />
        </h3>
        <p className="mt-1 text-[10px] font-normal tracking-[0.12em] uppercase text-muted-foreground sm:text-xs">
          {wreath.season} · {wreath.size}
        </p>
      </div>
      <p className={cn("shrink-0 text-sm font-medium", priceClassName)}>
        {formatPrice(wreath.price)}
      </p>
    </div>
  );
}
