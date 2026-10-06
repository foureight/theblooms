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
        className="mt-14 border-t border-border pt-10 sm:mt-20 sm:pt-12"
        aria-labelledby={id}
      >
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
            <div key={faq.question} className="border-t border-bloom/30 pt-4 sm:pt-5">
              <h3 className="font-display text-xl text-moss-deep sm:text-2xl">
                {faq.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:mt-3">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}
