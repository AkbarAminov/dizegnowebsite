import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Run with `npm run db:seed`. Safe to re-run: projects are upserted by slug.
try {
  process.loadEnvFile();
} catch {}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL ?? "");
const prisma = new PrismaClient({ adapter });

type SeedImage = { width: number; height: number };
type SeedProject = {
  slug: string;
  title: string;
  category: string;
  year: number;
  description: string;
  production?: string;
  fields?: { label: string; value: string }[];
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
const CATEGORIES = {
  FINANCE: "Finance & Banking",
  AUTOMOTIVE: "Automotive",
  FOOD: "Food & Delivery",
  HEALTH: "Healthcare",
  SPORT: "Sport & Events",
  OTHER: "Other",
} as const;

const projects: SeedProject[] = [
  {
    slug: "north-star-identity",
    title: "North Star Identity",
    category: CATEGORIES.FINANCE,
    year: 2026,
    description: "A flexible identity system built around a single rotating mark.",
    production: "Studio North, Ana Petrova",
    fields: [{ label: "Client", value: "North Star Bank" }],
    images: [LANDSCAPE, PORTRAIT, SQUARE, LANDSCAPE],
  },
  {
    slug: "verge-brand-strategy",
    title: "Verge Brand Strategy",
    category: CATEGORIES.FINANCE,
    year: 2026,
    description: "Positioning and naming for an early-stage fintech spin-out.",
    fields: [{ label: "Client", value: "Verge" }],
    images: [LANDSCAPE, SQUARE, LANDSCAPE, PORTRAIT],
  },
  {
    slug: "kinetic-motion-reel",
    title: "Kinetic Motion Reel",
    category: CATEGORIES.AUTOMOTIVE,
    year: 2025,
    description: "A short reel exploring type-driven motion for a new model launch.",
    production: "Motion Lab",
    fields: [{ label: "Client", value: "Kinetic Motors" }],
    images: [PORTRAIT, LANDSCAPE, PORTRAIT],
  },
  {
    slug: "drift-retail-concept",
    title: "Drift Retail Concept",
    category: CATEGORIES.AUTOMOTIVE,
    year: 2024,
    description: "Showroom concept and interior graphics for a car dealership network.",
    production: "Atlas Studio",
    fields: [{ label: "Client", value: "Drift Auto Group" }],
    images: [SQUARE, PORTRAIT],
  },
  {
    slug: "harbor-packaging-system",
    title: "Harbor Packaging System",
    category: CATEGORIES.FOOD,
    year: 2025,
    description: "Modular packaging for a coastal seafood and grocery delivery brand.",
    fields: [{ label: "Client", value: "Harbor Goods" }, { label: "Award", value: "ADC Bronze, 2025" }],
    images: [SQUARE, LANDSCAPE, PORTRAIT],
  },
  {
    slug: "loop-app-interface",
    title: "Loop App Interface",
    category: CATEGORIES.FOOD,
    year: 2025,
    description: "Visual identity and interface for an on-demand food-delivery app.",
    fields: [{ label: "Client", value: "Loop" }],
    images: [SQUARE, LANDSCAPE],
  },
  {
    slug: "atlas-signage-program",
    title: "Atlas Signage Program",
    category: CATEGORIES.HEALTH,
    year: 2024,
    description: "Wayfinding and signage for a hospital campus.",
    production: "Atlas Studio, Jon Reyes",
    fields: [{ label: "Client", value: "Atlas Health" }],
    images: [PORTRAIT, SQUARE, PORTRAIT],
  },
  {
    slug: "meridian-annual-report",
    title: "Meridian Annual Report",
    category: CATEGORIES.HEALTH,
    year: 2023,
    description: "Data-forward layout for a healthcare insurance group's annual report.",
    production: "Studio North",
    fields: [{ label: "Client", value: "Meridian Health" }],
    images: [LANDSCAPE, PORTRAIT, SQUARE],
  },
  {
    slug: "aperture-festival-identity",
    title: "Aperture Festival Identity",
    category: CATEGORIES.SPORT,
    year: 2026,
    description: "A generative identity system for a photography festival.",
    fields: [{ label: "Client", value: "Aperture Festival" }, { label: "Award", value: "Type Directors Club, 2026" }],
    images: [LANDSCAPE, SQUARE, PORTRAIT, LANDSCAPE],
  },
  {
    slug: "silo-editorial-layout",
    title: "Silo Editorial Layout",
    category: CATEGORIES.OTHER,
    year: 2024,
    description: "A grid system for a quarterly print publication about architecture.",
    production: "Studio North",
    images: [LANDSCAPE, PORTRAIT],
  },
];

async function main() {
  for (const [index, p] of projects.entries()) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        category: p.category,
        year: p.year,
        description: p.description,
        production: p.production,
        fields: {
          deleteMany: {},
          create: (p.fields ?? []).map((field, i) => ({ ...field, order: i })),
        },
      },
      create: {
        slug: p.slug,
        title: p.title,
        category: p.category,
        year: p.year,
        description: p.description,
        production: p.production,
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
        fields: {
          create: (p.fields ?? []).map((field, i) => ({ ...field, order: i })),
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
