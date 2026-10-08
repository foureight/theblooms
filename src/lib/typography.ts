const NBSP = "\u00A0";

/**
 * Czech typography: one-letter words (a, i, k, o, s, u, v, z) must not
 * sit alone at the end of a line — glue them to the following word with NBSP.
 */
export function fixCzechOrphans(text: string): string {
  if (!text) return text;
  return (
    text
      // single-letter prepositions / conjunctions
      .replace(/(^|[\s([„"«])([KkOoSsUuVvZzAaIi])\s+/g, `$1$2${NBSP}`)
      // number + short unit (4 dnů, 30 cm, 990 Kč)
      .replace(
        /(\d)\s+(Kč|ks|cm|mm|m²|m|dnů|dny|dní|den|hod|€|%)/gi,
        `$1${NBSP}$2`,
      )
  );
}
