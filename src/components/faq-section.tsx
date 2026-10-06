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
        className="mt-20 border-t border-border pt-12"
        aria-labelledby={id}
      >
        <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
          Časté otázky
        </p>
        <h2 id={id} className="mt-2 font-display text-5xl text-moss-deep">
          {title}
        </h2>
        <div className="mt-10 max-w-3xl space-y-8">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-t border-bloom/30 pt-5">
              <h3 className="text-base font-medium tracking-wide text-foreground">
                {faq.question}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}
