import { FadeIn } from "@/components/fade-in";
import type { FaqItem } from "@/lib/seo";
import { fixCzechOrphans } from "@/lib/typography";

type Props = {
  id?: string;
  title?: string;
  faqs: FaqItem[];
};

/**
 * White FAQ through to the green footer (no gray strip under FAQ).
 * Uses 100% width — not w-screen — so no left overflow stripe.
 */
export function FaqSection({
  id = "faq",
  title = "FAQ",
  faqs,
}: Props) {
  return (
    <section
      className="relative mt-20 bg-white py-14 pb-0 shadow-[0_100vh_0_0_#fff] sm:mt-28 sm:py-20 sm:pb-0"
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
          <div className="mt-8 max-w-3xl space-y-6 sm:mt-10 sm:space-y-8">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="border-t border-bloom/30 pt-4 sm:pt-5"
              >
                <h3 className="font-display text-xl text-moss-deep sm:text-2xl">
                  {fixCzechOrphans(faq.question)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:mt-3">
                  {fixCzechOrphans(faq.answer)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
