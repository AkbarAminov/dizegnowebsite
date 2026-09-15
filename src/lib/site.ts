// Labels come from the dictionary (dict.nav[key]) so they follow the
// current locale; only the (unprefixed, ru-default) href lives here.
export const NAV_LINKS = [
  { href: "/work/", key: "work" },
  { href: "/services/", key: "services" },
  { href: "/answers/", key: "answers" },
  { href: "/contact/", key: "contact" },
] as const;

export const CONTACT = {
  email: "dizegno.design@gmail.com",
  phones: [
    { number: "+998 (93) 393 82 74", href: "tel:+998933938274" },
    { number: "+998 (95) 103 40 33", href: "tel:+998951034033" },
  ],
  telegram: "@dizegnoagency",
  telegramHref: "https://t.me/dizegnoagency",
  instagram: "@dizegnoagency",
  instagramHref: "https://instagram.com/dizegnoagency",
} as const;

// Facts about the company that never change per locale — used by the
// structured data (schema.org) and the footer.
export const SITE = {
  legalName: "Dizegno Branding Agency",
  founder: "Akbar Aminov",
  founderRole: "Founder & Creative Director",
  city: "Tashkent",
  countryCode: "UZ",
  areaServed: ["Uzbekistan", "Kazakhstan", "Russia", "CIS"],
} as const;
