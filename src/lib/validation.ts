import { z } from "zod";
import { DEFAULT_LOCALE } from "./i18n";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email address"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;

const optionalText = z.string().trim().transform((value) => value || null);

// Every locale's copy is optional except the title in the default locale —
// that's the one piece of content a project can't be published without
// (checked in validateProjectInput, since zod validates each locale the
// same way and doesn't know which one is the default).
const translationSchema = z.object({
  title: z.string().trim(),
  category: optionalText,
  description: optionalText,
  production: optionalText,
});

const fieldTranslationSchema = z.object({ label: z.string().trim(), value: z.string().trim() });

export const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug may only contain lowercase letters, digits and hyphens"),
  year: z.number().int().min(1900).max(2100).nullable(),
  translations: z.object({ ru: translationSchema, en: translationSchema, uz: translationSchema }),
  fields: z.array(
    z.object({
      translations: z.object({ ru: fieldTranslationSchema, en: fieldTranslationSchema, uz: fieldTranslationSchema }),
    })
  ),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// Only checks the title when translations are part of the payload — a PATCH
// that just toggles published/pinned doesn't send them.
export function validateProjectInput(data: { translations?: ProjectInput["translations"] }): string | null {
  if (data.translations && !data.translations[DEFAULT_LOCALE].title.trim()) return "Title is required";
  return null;
}

export const projectPatchSchema = projectSchema.partial().extend({
  published: z.boolean().optional(),
  pinned: z.boolean().optional(),
});

export const orderSchema = z.object({ order: z.array(z.string()).min(1) });

export const fitModeSchema = z.object({ fitMode: z.enum(["cover", "contain"]) });

export const youtubeSchema = z.object({ url: z.string().trim() });

export const readSchema = z.object({ read: z.boolean() });
