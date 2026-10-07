import { FadeIn } from "@/components/fade-in";
import type { FaqItem } from "@/lib/seo";

type Props = {
  id?: string;
  title?: string;
  faqs: FaqItem[];
};

export function FaqSection({
  id = "faq",
  title = "FAQ",
  faqs,
}: Props) {
  return (
    <FadeIn>
      <section
        className="mt-14 bg-white py-10 sm:mt-20 sm:py-14"
        aria-labelledby={id}
      >
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
      </section>
    </FadeIn>
  );
}
