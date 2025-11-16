import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const menuCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/menu" }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    id: z.string(),
  }),
});

const changelogCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/changelog" }),
  schema: z.object({
    version: z.string(),
    date: z.date(),
    title: z.string().optional(),
  }),
});

export const collections = {
  menu: menuCollection,
  changelog: changelogCollection
};