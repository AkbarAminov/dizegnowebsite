import type { Dictionary } from "../i18n";

const dictionary: Dictionary = {
  nav: {
    work: "Work",
    services: "Services",
    answers: "Answers",
    contact: "Contact",
    homeAria: "Dizegno home",
    menuOpenAria: "Open menu",
    menuCloseAria: "Close menu",
  },
  seo: {
    home: {
      title: "Dizegno — Branding Agency in Tashkent",
      description:
        "Identity, visual systems, naming, packaging and brand strategy for banks, retail and startups across Uzbekistan and the CIS. Fixed price, founder-led projects.",
    },
    work: {
      title: "Work",
      description:
        "Dizegno case studies: identity, packaging, strategy and campaigns for banking, retail, delivery, healthcare and sports across Uzbekistan and the CIS.",
    },
    services: {
      title: "Services: Identity, Brand Guidelines, Naming, Packaging",
      description:
        "Logo and identity design, brand guidelines, naming, packaging, rebranding and brand strategy in Tashkent. Fixed price and timeline before we start.",
    },
    answers: {
      title: "Answers",
      description:
        "How Dizegno works: where to start, what branding costs, timelines, NDAs, ownership of the result and working alongside your team.",
    },
    contact: {
      title: "Contact",
      description:
        "Reach Dizegno on Telegram, email or phone. Tashkent, Uzbekistan. We reply within a business day and follow up with a fixed-price proposal.",
    },
    projectFallback: "{title} — a case study by Dizegno, branding agency in Tashkent.",
  },
  home: {
    selectedWork: { all: "All work" },
  },
  services: {
    title: "Services",
    includesLabel: "What's included",
    resultLabel: "Outcome",
    items: [
      {
        title: "Identity and visual system",
        summary:
          "The studio's core format. We design the visual system — mark, colour, typography, graphic language and the rules for applying them. The system is built to stay coherent once other people start working with it: your in-house marketing, the printer, signage contractors, the digital team.",
        includes: [
          "Mark and logo: variants, clear space, scaling rules",
          "Colour system with technical values for print and screen",
          "Typographic hierarchy and typesetting rules",
          "Graphic language: patterns, illustration, photo style principles",
          "Key touchpoints: documents, presentation, digital, signage",
          "Brand guidelines with usage rules and common mistakes",
        ],
        result:
          "A system any contractor can apply without you in the room. You stop being the approval bottleneck on every layout.",
      },
      {
        title: "Brand strategy and positioning",
        summary:
          "For when it's unclear what sets the brand apart and what to say to the audience. We research the category, the competitive field and current perception, formulate the brand platform — and only then move to the visual side. This is what turns design decisions from matters of taste into arguable ones.",
        includes: [
          "Audit of the current brand and the competitive field",
          "Interviews with key people in the company",
          "Audience profile and working insights",
          "Positioning, values, brand character",
          "Tone of voice and key messages",
          "Brand architecture for product lines",
        ],
        result:
          "A brand platform — the document design, marketing and communication build on. Internal arguments about “what's right” stop being settled by seniority and start being settled by the document.",
      },
      {
        title: "Naming",
        summary:
          "A name, descriptor and tagline for a new brand or product. We check how the name behaves in reality: how it sounds and reads in three languages, works as a domain and a social handle, fits on a sign, and doesn't clash with registered trademarks.",
        includes: [
          "Naming criteria and territory of meaning",
          "Long list with the rationale behind each direction",
          "Short list with a recommendation",
          "Sound and readability check in Russian, Uzbek and English",
          "Domain and social handle availability",
          "Descriptor and tagline",
        ],
        result:
          "A name you can take to trademark registration, and a rationale you can take to the board.",
      },
      {
        title: "Packaging",
        summary:
          "Packaging and label design: from a single product to a range that scales to dozens of SKUs. We work through to print-ready files and technical documentation — artwork that looks good in a presentation but falls apart at the printer doesn't count as finished work.",
        includes: [
          "Concept and range architecture",
          "Front and information panel design",
          "Adaptation to formats, materials and print methods",
          "Print-ready files with specifications",
          "Printer support through the first run",
        ],
        result:
          "Artwork the printer accepts without corrections, and a system the next products in the range can be built on without a new project.",
      },
      {
        title: "Rebranding",
        summary:
          "Renewing a brand that has outgrown its style: the product, audience, scale or ownership has changed. The real work here isn't the new mark — it's deciding which of the recognition you've built to keep, and planning the transition, because the transition is where brands fall apart.",
        includes: [
          "Identity audit and a full inventory of touchpoints",
          "Transition strategy: what to keep, what to change, what to drop",
          "New visual system",
          "Rollout plan by touchpoint and priority, in stages",
          "Guidelines for the in-house team and contractors",
        ],
        result:
          "A renewed brand and a plan that moves signage, documents and digital onto the new system without a period where the company looks like two different ones.",
      },
      {
        title: "Touchpoints and communication",
        summary:
          "Everything where the brand meets people after launch: wayfinding and signage, annual reports and presentations, campaigns, digital, merchandise. We work as an extension of your team — by your existing guidelines or ours.",
        includes: [
          "Wayfinding, signage, interior branding",
          "Presentations, annual reports, corporate documents",
          "Advertising campaigns and key visuals",
          "Templates for digital and social media",
          "Merchandise and promotional items",
        ],
        result:
          "Touchpoints that look like one brand, not like ten different contractors inside one company.",
      },
    ],
    process: {
      title: "How the work happens",
      subtitle: "(step by step)",
      prevAria: "Previous step",
      nextAria: "Next step",
      steps: [
        {
          title: "Brief and project scope",
          text: "We unpack the task, audience, and success criteria. Scope, timeline, and price are fixed before we start.",
        },
        {
          title: "Research",
          text: "We study the market, competitors, and how the brand is currently perceived. We find what to build the difference on.",
        },
        {
          title: "Strategy and directions",
          text: "We shape the positioning and present concept directions. One gets chosen.",
        },
        {
          title: "System design",
          text: "Mark, typography, color, and usage rules. Work happens in rounds — the number is set upfront.",
        },
        {
          title: "Production and documentation",
          text: "Guidelines, final files, technical documentation for contractors. Rights transfer to you in full.",
        },
        {
          title: "Launch and support",
          text: "We help the team put the system to use after launch. Brands fall apart at rollout, not at design.",
        },
      ],
    },
  },
  work: {
    title: "Work",
    all: "All",
  },
  partners: { title: "Partners & Clients" },
  projectNav: {
    back: "Back",
    previous: "Previous",
    next: "Next",
    related: "Related projects",
  },
  projectInfo: { toggle: "Project info", aboutLabel: "About the project" },
  gallery: { view: "View", openImage: "Open image", openVideo: "Open video" },
  answers: { title: "Answers" },
  contact: {
    title: "Contact",
    lead:
      "Send a few lines about the company and the task: what the brand is, what stage it's at, what you'd like to change. No brief required — we'll work it out on the first call.",
    channelsTitle: "Directly",
    location: "Tashkent, Uzbekistan",
    timezone: "GMT+5 · we reply within a business day",
    ndaNote: "Confidential project? Say so — we'll sign an NDA before discussing details.",
    formTitle: "Write to us",
    formName: "Name",
    formEmail: "Email",
    formPhone: "Phone or Telegram",
    formPhoneHint: "Optional — if that's easier than email",
    formMessage: "About the task",
    formMessageHint: "Company, what needs doing, desired timing",
    formSubmit: "Send",
    formSubmitting: "Sending...",
    formSuccess: "Thanks — we've got your message.",
    formSuccessHint: "We'll reply within a business day to the email or messenger you left.",
    formError: "Couldn't send. Please try again or write to us on Telegram.",
    privacyNote: "We use the details from this form only to reply to your request.",
  },
  contactPopup: {
    title: "Tell us about the task",
    intro: "A few lines about the company and the task — we'll reply within a business day and suggest a time to talk.",
    closeAria: "Close",
    openAria: "Open contact form",
  },
  endCta: {
    line1: "Branding without compromise",
    cta: "Discuss the project",
  },
  footer: {
    tagline:
      "We connect strategy, design and production so a brand stays coherent everywhere people see it.",
    navTitle: "Sections",
    contactTitle: "Contact",
    socialTitle: "Social",
    languageTitle: "Language",
    rights: "All rights reserved",
    location: "Tashkent, Uzbekistan",
  },
  notFound: {
    title: "Page not found",
    text: "The link may be out of date, or there's a typo in the address.",
    cta: "Back to the home page",
  },
};

export default dictionary;
