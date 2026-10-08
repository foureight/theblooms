const NBSP = "\u00A0";

/**
 * Czech typography: one-letter words (a, i, k, o, s, u, v, z) must not
 * sit alone at the end of a line — glue them to the following word with NBSP.
 */
export function fixCzechOrphans(text: string): string {
  if (!text) return text;
  return (
    text
      // keep em/en dash with the following word
      .replace(/([—–])\s+/g, `$1${NBSP}`)
      // single-letter prepositions / conjunctions (repeat for sequences: "a i na")
      .replace(/(^|[\s([„"«])([KkOoSsUuVvZzAaIi])\s+/g, `$1$2${NBSP}`)
      .replace(/(^|[\s([„"«])([KkOoSsUuVvZzAaIi])\s+/g, `$1$2${NBSP}`)
      // common two-letter prepositions
      .replace(
        /(^|[\s([„"«])([Dd]o|[Kk]e|[Kk]u|[Nn]a|[Oo]d|[Pp]o|[Ss]e|[Vv]e|[Zz]a|[Zz]e)\s+/g,
        `$1$2${NBSP}`,
      )
      // number + short unit (4 dnů, 30 cm, 990 Kč)
      .replace(
        /(\d)\s+(Kč|ks|cm|mm|m²|m|dnů|dny|dní|den|hod|€|%)/gi,
        `$1${NBSP}$2`,
      )
  );
}
