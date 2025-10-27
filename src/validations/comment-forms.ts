import z from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(1).max(5000),
  articleId: z.number().int().positive(),
  userId: z.string().min(1),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export const editCommentSchema = z.object({
  content: z.string().min(1).max(5000),
  commentId: z.number().int().positive(),
  userId: z.string().min(1),
});

export type EditCommentInput = z.infer<typeof editCommentSchema>;
