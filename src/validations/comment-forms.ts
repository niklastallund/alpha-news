import z from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  articleId: z.number().int().positive(),
  userId: z.string().min(1),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
