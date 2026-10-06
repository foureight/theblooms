import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatPrice, getWreath, wreaths } from "@/data/wreaths";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return wreaths.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const wreath = getWreath(slug);
  if (!wreath) return { title: "Věnec" };
  return {
    title: wreath.name,
    description: wreath.description,
  };
}

export default async function WreathDetailPage({ params }: Props) {
  const { slug } = await params;
  const wreath = getWreath(slug);
  if (!wreath) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <Link
        href="/vence"
        className="text-xs tracking-[0.16em] uppercase text-muted-foreground hover:text-foreground"
      >
        ← Všechny věnce
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden bg-stone">
          <Image
            src={wreath.image}
            alt={wreath.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
            {wreath.season}
          </p>
          <h1 className="mt-2 font-display text-5xl text-moss-deep sm:text-6xl">
            {wreath.name}
          </h1>
          <p className="mt-4 text-2xl font-medium">{formatPrice(wreath.price)}</p>
          <dl className="mt-8 space-y-3 border-y border-border py-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Rozměr</dt>
              <dd>{wreath.size}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Dostupnost</dt>
              <dd>{wreath.available ? "Skladem" : "Momentálně nedostupné"}</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {wreath.description}
          </p>
          <div className="mt-8">
            <AddToCartButton wreath={wreath} />
          </div>
        </div>
      </div>
    </div>
  );
}
