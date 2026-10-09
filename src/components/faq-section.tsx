import { FadeIn } from "@/components/fade-in";
import type { FaqItem } from "@/lib/seo";
import { fixCzechOrphans } from "@/lib/typography";

type Props = {
  id?: string;
  title?: string;
  faqs: FaqItem[];
};

/**
 * Full-bleed white FAQ (breaks out of max-w-7xl parents).
 * Questions start collapsed; answers open on click.
 */
export function FaqSection({
  id = "faq",
  title = "FAQ",
  faqs,
}: Props) {
  return (
    <section
      className="relative z-0 mt-20 ml-[calc(50%-50vw)] w-screen bg-white py-14 sm:mt-28 sm:py-20"
      aria-labelledby={id}
    >
      <FadeIn>
        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
          <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground sm:text-xs">
            Časté otázky
          </p>
          <h2
            id={id}
            className="mt-2 font-display text-4xl text-moss-deep sm:text-5xl md:text-6xl"
          >
            {title}
          </h2>
          <div className="mt-8 w-full sm:mt-10">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                open={index === 0 ? true : undefined}
                className="group border-t border-bloom/30 open:pb-1"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 sm:py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-xl text-moss-deep sm:text-2xl">
                    {fixCzechOrphans(faq.question)}
                  </h3>
                  <span
                    aria-hidden
                    className="mt-1.5 shrink-0 text-lg leading-none text-moss-deep/50 transition-transform group-open:rotate-45 sm:mt-2 sm:text-xl"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-3xl pb-5 text-sm leading-relaxed text-muted-foreground sm:pb-6">
                  {fixCzechOrphans(faq.answer)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
