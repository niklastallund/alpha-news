import z from "zod";

export const createArticleSchema = z.object({
  headline: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  editorsChoice: z.boolean().optional(),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;