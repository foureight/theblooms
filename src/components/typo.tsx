import { fixCzechOrphans } from "@/lib/typography";

/** Renders Czech copy with non-breaking spaces after one-letter words. */
export function Typo({ children }: { children: string }) {
  return <>{fixCzechOrphans(children)}</>;
}
