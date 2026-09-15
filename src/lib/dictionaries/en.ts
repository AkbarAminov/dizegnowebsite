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
    hero: {
      eyebrow: "Branding agency · Tashkent",
      title: "Branding for companies that play the long game",
      lead:
        "We design identities, visual systems, packaging and brand strategy for banks, retail, services and startups across Uzbekistan and the CIS. Every project is led by the founder — from the brief to the final files.",
      primaryCta: "Discuss a project",
      secondaryCta: "See the work",
    },
    facts: [
      { title: "One person in charge", text: "The founder and creative director leads every project from brief to delivery" },
      { title: "Price before we start", text: "A fixed fee and timeline — no open-ended estimates, no hourly billing" },
      { title: "NDA and full rights", text: "We sign an NDA before details are discussed; all rights transfer to you" },
    ],
    selectedWork: { title: "Selected work", all: "All work" },
    services: {
      title: "Services",
      intro:
        "From a refresh of an existing mark to a full brand system with packaging and signage. Scope follows the task, not a price list.",
      all: "More about services",
    },
    process: {
      title: "How we work",
      intro: "Four stages that are clear from day one: you always know what is happening and what comes next.",
      steps: [
        {
          title: "Conversation and brief",
          text: "We unpack the task, the audience and the criteria for success. No brief yet? We write it together. Then we fix the scope, timeline and price.",
        },
        {
          title: "Research and direction",
          text: "We study the market, competitors and context, find the idea and present concept directions at the first review.",
        },
        {
          title: "Design in rounds",
          text: "We build the system, review, refine — until everything falls into place. The number of rounds is agreed in advance.",
        },
        {
          title: "Production and handover",
          text: "Final files, guidelines and technical documentation, with the rights transferred. We stay in touch through implementation.",
        },
      ],
    },
    why: {
      title: "Why Dizegno",
      intro:
        "We grew from one designer's practice into an agency clients come back to — for rigour and craft, not the size of the roster.",
      items: [
        {
          title: "A system, not a picture",
          text: "The logo is the smallest part of the job. We design the rules that keep a brand coherent on a sign, in an app and on a shelf years later.",
        },
        {
          title: "Responsibility doesn't get diluted",
          text: "There is no chain of account manager, strategist and designer between you and the result. Akbar Aminov curates every project personally.",
        },
        {
          title: "Experience in demanding industries",
          text: "Banking and fintech, retail, delivery, healthcare, automotive, sports events — where precision matters more than flash.",
        },
        {
          title: "Ready for production",
          text: "We hand over files that printers, contractors and developers accept without questions — not just pictures.",
        },
      ],
    },
    industries: {
      title: "Industries",
      items: ["Banking & fintech", "Retail", "Delivery & services", "Healthcare", "Automotive", "Sport & events", "Startups"],
    },
  },
  services: {
    title: "Services",
    intro:
      "We take on projects of any scale — from refreshing a mark to a full brand system with packaging and signage. Here is what each engagement consists of and what you get at the end.",
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
    terms: {
      title: "How we work together",
      items: [
        {
          title: "Pricing",
          text: "Project-based, not hourly. The price is tied to scope — the number of touchpoints, rounds and the depth of production. You get a fixed sum before we start.",
        },
        {
          title: "Timelines",
          text: "A refresh of a mark moves fast; a full system with packaging and signage takes longer. We fix the exact timeline together with the price after the first conversation.",
        },
        {
          title: "Rights and confidentiality",
          text: "We sign an NDA on request before details are discussed. After payment, all rights, source files and guidelines transfer to the client.",
        },
        {
          title: "Format",
          text: "We work as an independent team or plug into your marketing department or another agency — for a specific part of the task.",
        },
      ],
    },
  },
  work: {
    title: "Work",
    intro:
      "Identity, packaging, strategy and campaigns for banks, retail, services and startups. Some projects are under NDA — we'll show those in person.",
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
  answers: {
    title: "Answers",
    intro: "How we work, what it costs and where to start — short and to the point. Didn't find your answer? Write to us and we'll reply personally.",
  },
  contact: {
    title: "Contact",
    lead:
      "Send a few lines about the company and the task: what the brand is, what stage it's at, what you'd like to change. No brief required — we'll work it out on the first call.",
    channelsTitle: "Directly",
    location: "Tashkent, Uzbekistan",
    timezone: "GMT+5 · we reply within a business day",
    ndaNote: "Confidential project? Say so — we'll sign an NDA before discussing details.",
    nextTitle: "What happens next",
    nextSteps: [
      {
        title: "A reply within a day",
        text: "We'll clarify a couple of questions and suggest a time for a short call or a meeting in Tashkent.",
      },
      {
        title: "A conversation about the task",
        text: "30–40 minutes: context, goals, timing. Afterwards it's clear how we can help and at what scope.",
      },
      {
        title: "A proposal with price and timeline",
        text: "A fixed fee, the scope of work and a calendar — before we start, no open-ended estimates.",
      },
    ],
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
    line1: "Have a task for your brand?",
    cta: "Write to us — we reply within a day",
  },
  footer: {
    tagline: "Branding agency in Tashkent. Identity, strategy and packaging for companies across Uzbekistan and the CIS.",
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
