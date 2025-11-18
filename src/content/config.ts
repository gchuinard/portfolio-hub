import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    slug: z.string().optional(),
    tags: z.array(z.string()).optional(),
    stack: z.array(z.string()).optional(),
    image: z.string().optional(),
    featured: z.boolean().optional(),
    demo: z.string().url().optional(),
    repo: z.string().url().optional(),
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
    tags: z.array(z.string()).default([]),
    logo: z.string().optional(),
  }),
});

export const collections = { projects, certifications };
