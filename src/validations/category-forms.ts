import z from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  onNavbar: z.boolean().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(30).optional(),
  onNavbar: z.boolean().optional(),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
