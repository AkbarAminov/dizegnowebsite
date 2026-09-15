import type { AnswerSection, Project } from "./types";
import type { Dictionary, Locale } from "./i18n";
import { localeHref } from "./i18n";
import { CONTACT, SITE } from "./site";
import { SITE_NAME, SITE_URL, absoluteUrl, plainText, truncate } from "./seo";

// schema.org builders. Every public page links back to the same
// Organization node via @id so search engines merge the signals.

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function organizationJsonLd(dict: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    legalName: SITE.legalName,
    url: SITE_URL,
    logo: absoluteUrl("/logo.svg"),
    image: absoluteUrl("/api/og/"),
    description: plainText(dict.seo.home.description),
    founder: { "@type": "Person", name: SITE.founder, jobTitle: SITE.founderRole },
    email: CONTACT.email,
    telephone: CONTACT.phones[0].href.replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressCountry: SITE.countryCode,
    },
    areaServed: SITE.areaServed,
    sameAs: [CONTACT.instagramHref, CONTACT.telegramHref],
    contactPoint: CONTACT.phones.map((phone) => ({
      "@type": "ContactPoint",
      telephone: phone.href.replace("tel:", ""),
      contactType: "sales",
      availableLanguage: ["ru", "en", "uz"],
    })),
    knowsAbout: dict.services.items.map((item) => plainText(item.title)),
  };
}

export function servicesJsonLd(dict: Dictionary, lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: dict.services.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: plainText(item.title),
        description: plainText(item.summary),
        provider: { "@id": ORGANIZATION_ID },
        areaServed: SITE.areaServed,
        url: `${absoluteUrl(localeHref(lang, "/services/"))}#service-${i + 1}`,
      },
    })),
  };
}

export function faqJsonLd(sections: AnswerSection[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sections.flatMap((section) =>
      section.items.map((item) => ({
        "@type": "Question",
        name: plainText(item.question),
        acceptedAnswer: { "@type": "Answer", text: plainText(item.answer) },
      }))
    ),
  };
}

export function projectJsonLd(project: Project, lang: Locale) {
  const year = project.credits.find((credit) => /^\d{4}$/.test(credit.value))?.value;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: plainText(project.title),
    description: truncate(project.description, 300),
    url: absoluteUrl(localeHref(lang, `/work/${project.slug}/`)),
    image: project.gallery.filter((image) => image.type !== "youtube").map((image) => absoluteUrl(image.src)),
    genre: project.category ? plainText(project.category) : undefined,
    dateCreated: year,
    creator: { "@id": ORGANIZATION_ID },
    inLanguage: lang,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[], lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: plainText(item.name),
      item: absoluteUrl(localeHref(lang, item.path)),
    })),
  };
}
