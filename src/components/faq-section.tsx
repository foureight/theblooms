import { FadeIn } from "@/components/fade-in";
import type { FaqItem } from "@/lib/seo";

type Props = {
  id?: string;
  title?: string;
  faqs: FaqItem[];
};

/**
 * Full-bleed white FAQ. White continues to the green footer via a downward
 * box-shadow plus the layout flex filler — no gray body strip in between.
 */
export function FaqSection({
  id = "faq",
  title = "FAQ",
  faqs,
}: Props) {
  return (
    <section
      className="relative left-1/2 mt-20 mb-0 w-screen -translate-x-1/2 bg-white py-14 shadow-[0_100vh_0_0_#fff] sm:mt-28 sm:py-20"
      aria-labelledby={id}
    >
      <FadeIn>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground sm:text-xs">
            Časté otázky
          </p>
          <h2
            id={id}
            className="mt-2 font-display text-4xl text-moss-deep sm:text-5xl md:text-6xl"
          >
            {title}
          </h2>
          <div className="mt-8 max-w-3xl space-y-6 sm:mt-10 sm:space-y-8">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="border-t border-bloom/30 pt-4 sm:pt-5"
              >
                <h3 className="font-display text-xl text-moss-deep sm:text-2xl">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:mt-3">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
