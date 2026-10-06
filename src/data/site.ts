export const site = {
  name: "THE BLOOMS",
  tagline: "Floristické studio pro svatby, věnce a větší květinové realizace",
  email: "ahoj@theblooms.cz",
  phone: "+420 777 000 000",
  instagram: "https://instagram.com/theblooms",
  location: "Česká republika",
};

export const nav = [
  { href: "/svatby", label: "Svatby" },
  { href: "/vence", label: "Věnce" },
  { href: "/kytky", label: "Kytky" },
  { href: "/workshopy", label: "Workshopy" },
  { href: "/o-mne", label: "O mně" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export type InquiryType = "svatba" | "kytky" | "event" | "workshop" | "jine";

export const inquiryTypes: { value: InquiryType; label: string }[] = [
  { value: "svatba", label: "Svatba" },
  { value: "kytky", label: "Kytky" },
  { value: "event", label: "Event" },
  { value: "workshop", label: "Workshop" },
  { value: "jine", label: "Jiné" },
];
