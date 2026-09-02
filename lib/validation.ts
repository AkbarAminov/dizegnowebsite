import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email address"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;

const optionalText = z.string().trim().transform((value) => value || null);

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug may only contain lowercase letters, digits and hyphens"),
  category: optionalText,
  year: z.number().int().min(1900).max(2100).nullable(),
  description: optionalText,
  production: optionalText,
  fields: z.array(
    z.object({
      label: z.string().trim().min(1, "Field label is required"),
      value: z.string().trim().min(1, "Field value is required"),
    })
  ),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const projectPatchSchema = projectSchema.partial().extend({
  published: z.boolean().optional(),
  pinned: z.boolean().optional(),
});

export const orderSchema = z.object({ order: z.array(z.string()).min(1) });

export const fitModeSchema = z.object({ fitMode: z.enum(["cover", "contain"]) });

export const youtubeSchema = z.object({ url: z.string().trim() });

export const readSchema = z.object({ read: z.boolean() });
