import z from "zod";

export const createArticleSchema = z.object({
  headline: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  editorsChoice: z.boolean().optional(),
  categories: z.array(z.string()).optional(),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;

export const updateArticleSchema = z.object({
  id: z.number(),
  headline: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  editorsChoice: z.boolean().optional(),
});

export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;

export const updateArticleCategoriesSchema = z.object({
  articleId: z.number().int().positive(),
  categoryIds: z
    .array(z.number().int().positive())
    .min(1, "Select at least one category."),
});

export type UpdateArticleCategoriesInput = z.infer<
  typeof updateArticleCategoriesSchema
>;
