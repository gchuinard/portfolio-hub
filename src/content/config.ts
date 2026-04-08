import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    description: z.string(),
    descriptionEn: z.string().optional(),
    date: z.date(),
    slug: z.string().optional(),
    tags: z.array(z.string()).optional(),
    stack: z.array(z.string()).optional(),
    image: z.string().optional(),
    featured: z.boolean().optional(),
    demo: z.string().url().optional(),
    repo: z.string().url().optional(),
    status: z.union([
      z.enum(["online", "offline", "new", "updated", "in-progress", "planned", "beta"]),
      z.array(z.enum(["online", "offline", "new", "updated", "in-progress", "planned", "beta"])),
    ]).optional().transform(v => v ? (Array.isArray(v) ? v : [v]) : []),
  }),
});


const certifications = defineCollection({
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    issueDate: z.date(),
    expiryDate: z.date().optional(),
    credentialId: z.string().optional(),
    credentialUrl: z.string().url().optional(),
    status: z.enum(["earned", "in-progress", "planned"]).optional().default("earned"),
    tags: z.array(z.string()).default([]),
    logo: z.string().optional(),
  }),
});

const experiences = defineCollection({
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    company: z.string(),
    location: z.string().optional(),
    type: z.enum(["CDI", "CDD", "alternance", "stage", "freelance"]),
    startDate: z.date(),
    endDate: z.date().optional(),
    current: z.boolean().optional().default(false),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
    descriptionEn: z.string().optional(),
  }),
});

export const collections = { projects, certifications, experiences };
