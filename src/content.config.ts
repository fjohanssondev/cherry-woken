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

export const collections = {
  menu: menuCollection,
};