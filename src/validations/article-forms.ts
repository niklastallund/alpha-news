import z from "zod";

export const createArticleSchema = z.object({
  headline: z.string().min(1).max(500),
  summary: z.string().optional(),
  content: z.string().min(20).max(50000),
  image: z.string().optional(),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;