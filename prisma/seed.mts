import { PrismaClient, type Locale } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Run with `npm run db:seed`. Safe to re-run: projects are upserted by slug.
try {
  process.loadEnvFile();
} catch {}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL ?? "");
const prisma = new PrismaClient({ adapter });

// Kept local (rather than imported from src/lib/i18n) since this script
// runs as plain Node TS, without the app's "@/" path alias.
const LOCALES = ["ru", "en", "uz"] as const satisfies readonly Locale[];

type SeedImage = { width: number; height: number };
type Copy = { title: string; category: string; description: string; production: string | null };
type SeedField = Record<Locale, { label: string; value: string }>;
type SeedProject = {
  slug: string;
  year: number;
  translations: Record<Locale, Copy>;
  fields?: SeedField[];
  images: SeedImage[];
};

let seedCounter = 1;
function picsumUrl(image: SeedImage) {
  return `https://picsum.photos/${image.width}/${image.height}?random=${seedCounter++}`;
}

const LANDSCAPE: SeedImage = { width: 800, height: 600 };
const PORTRAIT: SeedImage = { width: 600, height: 800 };
const SQUARE: SeedImage = { width: 700, height: 700 };

// Categories are client sectors so the Work page filter reads as industries.
const CATEGORY = {
  FINANCE: { ru: "Финансы и банкинг", en: "Finance & Banking", uz: "Moliya va banking" },
  AUTOMOTIVE: { ru: "Автомобильная индустрия", en: "Automotive", uz: "Avtomobil sanoati" },
  FOOD: { ru: "Еда и доставка", en: "Food & Delivery", uz: "Ovqat va yetkazib berish" },
  HEALTH: { ru: "Здравоохранение", en: "Healthcare", uz: "Sog'liqni saqlash" },
  SPORT: { ru: "Спорт и события", en: "Sport & Events", uz: "Sport va tadbirlar" },
  OTHER: { ru: "Другое", en: "Other", uz: "Boshqa" },
} as const satisfies Record<string, Record<Locale, string>>;

const CREDIT_LABEL = {
  Client: { ru: "Клиент", en: "Client", uz: "Mijoz" },
  Award: { ru: "Награда", en: "Award", uz: "Mukofot" },
} as const satisfies Record<string, Record<Locale, string>>;

// Credit *values* (company/award names) are proper nouns and stay the same
// in every language; only the label ("Client" / "Клиент" / "Mijoz") changes.
function credit(labelKey: keyof typeof CREDIT_LABEL, value: string): SeedField {
  return {
    ru: { label: CREDIT_LABEL[labelKey].ru, value },
    en: { label: CREDIT_LABEL[labelKey].en, value },
    uz: { label: CREDIT_LABEL[labelKey].uz, value },
  };
}

function copy(
  category: keyof typeof CATEGORY,
  title: Record<Locale, string>,
  description: Record<Locale, string>,
  production: string | null = null
): Record<Locale, Copy> {
  return {
    ru: { title: title.ru, category: CATEGORY[category].ru, description: description.ru, production },
    en: { title: title.en, category: CATEGORY[category].en, description: description.en, production },
    uz: { title: title.uz, category: CATEGORY[category].uz, description: description.uz, production },
  };
}

const projects: SeedProject[] = [
  {
    slug: "north-star-identity",
    year: 2026,
    translations: copy(
      "FINANCE",
      { ru: "Айдентика North Star", en: "North Star Identity", uz: "North Star identifikatsiyasi" },
      {
        ru: "Гибкая система айдентики, построенная вокруг одного вращающегося знака.",
        en: "A flexible identity system built around a single rotating mark.",
        uz: "Bitta aylanuvchi belgi atrofida qurilgan moslashuvchan identifikatsiya tizimi.",
      },
      "Studio North, Ana Petrova"
    ),
    fields: [credit("Client", "North Star Bank")],
    images: [LANDSCAPE, PORTRAIT, SQUARE, LANDSCAPE],
  },
  {
    slug: "verge-brand-strategy",
    year: 2026,
    translations: copy(
      "FINANCE",
      { ru: "Брендовая стратегия Verge", en: "Verge Brand Strategy", uz: "Verge brend strategiyasi" },
      {
        ru: "Позиционирование и нейминг для fintech-стартапа на ранней стадии.",
        en: "Positioning and naming for an early-stage fintech spin-out.",
        uz: "Erta bosqichdagi fintech kompaniyasi uchun pozitsiyalash va nomlash.",
      }
    ),
    fields: [credit("Client", "Verge")],
    images: [LANDSCAPE, SQUARE, LANDSCAPE, PORTRAIT],
  },
  {
    slug: "kinetic-motion-reel",
    year: 2025,
    translations: copy(
      "AUTOMOTIVE",
      { ru: "Моушн-ролик Kinetic", en: "Kinetic Motion Reel", uz: "Kinetic Motion videoroliki" },
      {
        ru: "Короткий ролик с типографской анимацией для запуска новой модели.",
        en: "A short reel exploring type-driven motion for a new model launch.",
        uz: "Yangi model taqdimoti uchun tipografik animatsiyaga asoslangan qisqa video.",
      },
      "Motion Lab"
    ),
    fields: [credit("Client", "Kinetic Motors")],
    images: [PORTRAIT, LANDSCAPE, PORTRAIT],
  },
  {
    slug: "drift-retail-concept",
    year: 2024,
    translations: copy(
      "AUTOMOTIVE",
      { ru: "Ритейл-концепция Drift", en: "Drift Retail Concept", uz: "Drift chakana savdo kontseptsiyasi" },
      {
        ru: "Концепция шоурума и интерьерная графика для сети автодилеров.",
        en: "Showroom concept and interior graphics for a car dealership network.",
        uz: "Avtosalonlar tarmog'i uchun ko'rgazma zali kontseptsiyasi va interyer grafikasi.",
      },
      "Atlas Studio"
    ),
    fields: [credit("Client", "Drift Auto Group")],
    images: [SQUARE, PORTRAIT],
  },
  {
    slug: "harbor-packaging-system",
    year: 2025,
    translations: copy(
      "FOOD",
      { ru: "Упаковочная система Harbor", en: "Harbor Packaging System", uz: "Harbor qadoqlash tizimi" },
      {
        ru: "Модульная упаковка для бренда морепродуктов и доставки продуктов на побережье.",
        en: "Modular packaging for a coastal seafood and grocery delivery brand.",
        uz: "Qirg'oq bo'yidagi dengiz mahsulotlari va oziq-ovqat yetkazib berish brendi uchun modulli qadoqlash.",
      }
    ),
    fields: [credit("Client", "Harbor Goods"), credit("Award", "ADC Bronze, 2025")],
    images: [SQUARE, LANDSCAPE, PORTRAIT],
  },
  {
    slug: "loop-app-interface",
    year: 2025,
    translations: copy(
      "FOOD",
      { ru: "Интерфейс приложения Loop", en: "Loop App Interface", uz: "Loop ilovasi interfeysi" },
      {
        ru: "Визуальная айдентика и интерфейс для приложения доставки еды по запросу.",
        en: "Visual identity and interface for an on-demand food-delivery app.",
        uz: "Talab bo'yicha ovqat yetkazib berish ilovasi uchun vizual identifikatsiya va interfeys.",
      }
    ),
    fields: [credit("Client", "Loop")],
    images: [SQUARE, LANDSCAPE],
  },
  {
    slug: "atlas-signage-program",
    year: 2024,
    translations: copy(
      "HEALTH",
      { ru: "Программа навигации Atlas", en: "Atlas Signage Program", uz: "Atlas navigatsiya dasturi" },
      {
        ru: "Навигация и указатели для больничного кампуса.",
        en: "Wayfinding and signage for a hospital campus.",
        uz: "Shifoxona majmuasi uchun yo'l ko'rsatish va navigatsiya belgilari.",
      },
      "Atlas Studio, Jon Reyes"
    ),
    fields: [credit("Client", "Atlas Health")],
    images: [PORTRAIT, SQUARE, PORTRAIT],
  },
  {
    slug: "meridian-annual-report",
    year: 2023,
    translations: copy(
      "HEALTH",
      { ru: "Годовой отчёт Meridian", en: "Meridian Annual Report", uz: "Meridian yillik hisoboti" },
      {
        ru: "Ориентированная на данные вёрстка годового отчёта для группы медицинского страхования.",
        en: "Data-forward layout for a healthcare insurance group's annual report.",
        uz: "Tibbiy sug'urta guruhining yillik hisoboti uchun ma'lumotlarga yo'naltirilgan sahifalash.",
      },
      "Studio North"
    ),
    fields: [credit("Client", "Meridian Health")],
    images: [LANDSCAPE, PORTRAIT, SQUARE],
  },
  {
    slug: "aperture-festival-identity",
    year: 2026,
    translations: copy(
      "SPORT",
      { ru: "Айдентика фестиваля Aperture", en: "Aperture Festival Identity", uz: "Aperture festivali identifikatsiyasi" },
      {
        ru: "Генеративная система айдентики для фотофестиваля.",
        en: "A generative identity system for a photography festival.",
        uz: "Fotografiya festivali uchun generativ identifikatsiya tizimi.",
      }
    ),
    fields: [credit("Client", "Aperture Festival"), credit("Award", "Type Directors Club, 2026")],
    images: [LANDSCAPE, SQUARE, PORTRAIT, LANDSCAPE],
  },
  {
    slug: "silo-editorial-layout",
    year: 2024,
    translations: copy(
      "OTHER",
      { ru: "Editorial-вёрстка Silo", en: "Silo Editorial Layout", uz: "Silo jurnal sahifalash" },
      {
        ru: "Сеточная система для ежеквартального печатного издания об архитектуре.",
        en: "A grid system for a quarterly print publication about architecture.",
        uz: "Arxitektura haqidagi choraklik bosma nashr uchun grid tizimi.",
      },
      "Studio North"
    ),
    images: [LANDSCAPE, PORTRAIT],
  },
];

async function main() {
  for (const [index, p] of projects.entries()) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        year: p.year,
        translations: {
          deleteMany: {},
          create: LOCALES.map((locale) => ({ locale, ...p.translations[locale] })),
        },
        fields: {
          deleteMany: {},
          create: (p.fields ?? []).map((field, i) => ({ order: i, translations: field })),
        },
      },
      create: {
        slug: p.slug,
        year: p.year,
        order: index,
        published: true,
        images: {
          create: p.images.map((image, i) => ({
            url: picsumUrl(image),
            width: image.width,
            height: image.height,
            order: i,
          })),
        },
        translations: {
          create: LOCALES.map((locale) => ({ locale, ...p.translations[locale] })),
        },
        fields: {
          create: (p.fields ?? []).map((field, i) => ({ order: i, translations: field })),
        },
      },
    });
  }

  console.log(`Seeded ${projects.length} demo projects.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
