import Image from "next/image";

type Props = {
  title: string;
  image: string;
  imageAlt: string;
  eyebrow?: string;
};

/** Full-bleed photo header — same height language as Kytky, mobile-safe type */
export function PageHero({ title, image, imageAlt, eyebrow }: Props) {
  return (
    <div className="relative h-[38svh] min-h-[220px] overflow-hidden sm:h-[45svh] sm:min-h-[280px]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-moss-deep/40" />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8">
        {eyebrow ? (
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/70 sm:text-xs">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={`font-display leading-[1.05] text-white text-4xl sm:text-6xl md:text-7xl ${eyebrow ? "mt-2" : ""}`}
        >
          {title}
        </h1>
      </div>
    </div>
  );
}
