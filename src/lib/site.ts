// Labels come from the dictionary (dict.nav[key]) so they follow the
// current locale; only the (unprefixed, ru-default) href lives here.
export const NAV_LINKS = [
  { href: "/work/", key: "work" },
  { href: "/answers/", key: "answers" },
  { href: "/contact/", key: "contact" },
] as const;

export const CONTACT = {
  email: "dizegno.design@gmail.com",
  phone: "+998 93 393 82 74",
  phoneHref: "tel:+998933938274",
  telegram: "@Here_for",
  telegramHref: "https://t.me/Here_for",
} as const;
