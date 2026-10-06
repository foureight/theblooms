import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaLink } from "@/components/cta-link";
import { getWedding, weddings } from "@/data/weddings";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return weddings.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const wedding = getWedding(slug);
  if (!wedding) return { title: "Svatba" };
  return {
    title: wedding.title,
    description: wedding.summary,
  };
}

export default async function WeddingDetailPage({ params }: Props) {
  const { slug } = await params;
  const wedding = getWedding(slug);
  if (!wedding) notFound();

  const others = weddings.filter((w) => w.slug !== slug).slice(0, 2);

  return (
    <div>
      <div className="relative h-[55svh] min-h-[360px] w-full overflow-hidden">
        <Image
          src={wedding.cover}
          alt={wedding.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-moss-deep/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <p className="text-[11px] tracking-[0.2em] uppercase text-white/70">
            {wedding.season} · {wedding.place}
          </p>
          <h1 className="mt-2 font-display text-5xl text-white sm:text-6xl">
            {wedding.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          {wedding.summary}
        </p>
        <CtaLink href="/kontakt?typ=svatba" className="mt-8">
          Chci podobnou realizaci
        </CtaLink>

        <div className="mt-14 columns-1 gap-4 sm:columns-2">
          {wedding.images.map((src, i) => (
            <div key={src} className="mb-4 break-inside-avoid">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={src}
                  alt={`${wedding.title} — fotografie ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              </div>
            </div>
          ))}
        </div>

        {others.length > 0 && (
          <section className="mt-20 border-t border-border pt-12">
            <h2 className="font-display text-3xl text-moss-deep">
              Další svatby
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {others.map((w) => (
                <Link key={w.slug} href={`/svatby/${w.slug}`} className="group">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={w.cover}
                      alt={w.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 50vw"
                    />
                  </div>
                  <p className="mt-3 font-display text-2xl text-moss-deep">
                    {w.title}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
