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
          "Our core format. We design the brand's visual system — mark, logo, colour, typography, graphics and the rules for using them — so the brand looks whole on any medium and holds up once other people start working with it.",
        includes: [
          "Logo and mark, variants and clear space",
          "Colour system and typography",
          "Graphic language: patterns, illustration, photo style",
          "Key touchpoints: documents, presentation, social media, signage",
          "Brand guidelines with usage rules",
        ],
        result: "Guidelines and source files you can hand to any contractor.",
      },
      {
        title: "Brand strategy and positioning",
        summary:
          "For when it's unclear what makes the brand different and what to say to the audience. We research the market and competitors and formulate the brand platform — only then do we move to design. That's how decisions stop being a matter of taste.",
        includes: [
          "Audit of the current brand and competitors",
          "Audience profile and insights",
          "Positioning, values, character",
          "Tone of voice and key messages",
          "Brand architecture for product lines",
        ],
        result: "A brand platform — the document design, marketing and communication build on.",
      },
      {
        title: "Naming",
        summary:
          "A name, descriptor and tagline for a new brand or product. We check how the name sounds and reads in Russian, Uzbek and English, and how it behaves as a domain, a social handle and a sign.",
        includes: [
          "Naming criteria and territory of meaning",
          "Long list and short list with rationale",
          "Sound and readability check in three languages",
          "Domain and social handle availability",
          "Descriptor and tagline",
        ],
        result: "A short list with a recommendation and a name you can take to trademark registration.",
      },
      {
        title: "Packaging",
        summary:
          "Packaging and label design: from a single product to a range that scales to dozens of SKUs. We take artwork all the way to print-ready files with technical specifications for the printer.",
        includes: [
          "Concept and range architecture",
          "Front and information panel design",
          "Adaptation to formats and materials",
          "Print-ready files and specifications",
          "Printer support through the first run",
        ],
        result: "Artwork the printer accepts without questions, and a system for the products that follow.",
      },
      {
        title: "Rebranding",
        summary:
          "For a brand that has outgrown its style: the product, audience or scale has changed. We keep the recognition you've built, remove what gets in the way, and plan the transition so signage, documents and digital update without chaos.",
        includes: [
          "Audit of the identity and every touchpoint",
          "Strategy: what to keep, what to change",
          "New visual system",
          "Transition plan by touchpoint and priority",
          "Guidelines for the team and contractors",
        ],
        result: "A renewed brand and a clear rollout plan.",
      },
      {
        title: "Touchpoints and communication",
        summary:
          "Everything where the brand meets people after launch: signage and wayfinding, presentations and reports, campaigns, social media, merchandise. We work as an extension of your team — by your existing guidelines or ours.",
        includes: [
          "Wayfinding, signage, interior branding",
          "Presentations, annual reports, corporate documents",
          "Advertising campaigns and key visuals",
          "Social media and digital templates",
          "Merchandise and promotional items",
        ],
        result: "Touchpoints that look like one brand, not ten contractors.",
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
