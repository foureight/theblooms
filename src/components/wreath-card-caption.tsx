import {
  formatPrice,
  getWreathSizes,
  wreathMinPrice,
  wreathSizeRangeLabel,
  type Wreath,
} from "@/data/wreaths";
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
  wreath: Pick<Wreath, "name" | "season" | "size" | "price" | "sizes">;
  className?: string;
  titleClassName?: string;
  priceClassName?: string;
};

/** Name (2 lines) → season · sizes (if any) → price on the right. */
export function WreathCardCaption({
  wreath,
  className,
  titleClassName,
  priceClassName,
}: Props) {
  const sizes = getWreathSizes(wreath);
  const sizeLabel = wreathSizeRangeLabel(wreath);
  const minPrice = wreathMinPrice(wreath);
  const showFrom = sizes.length > 1;

  return (
    <div className={cn("mt-4", className)}>
      <div className="flex items-start justify-between gap-3">
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
            {sizeLabel ? `${wreath.season} · ${sizeLabel}` : wreath.season}
          </p>
        </div>
        <p className={cn("shrink-0 text-sm font-medium", priceClassName)}>
          {showFrom ? `od ${formatPrice(minPrice)}` : formatPrice(minPrice)}
        </p>
      </div>
      <p className="mt-3 text-[10px] leading-relaxed tracking-[0.06em] text-muted-foreground sm:text-xs">
        Výroba po obdržení objednávky do 4&nbsp;dnů + doprava
      </p>
    </div>
  );
}
