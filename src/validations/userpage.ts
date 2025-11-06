import z from "zod";

const FileLikeSchema = z
  .object({
    size: z.number().int().nonnegative(),
    type: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
  })
  .loose();

export const imageUploadSchema = z.object({
  file: FileLikeSchema.refine((f) => f.size > 0, { message: "No file!" })
    .refine((f) => f.size <= 5 * 1024 * 1024, {
      message: "File too large (max 5MB)",
    })
    .refine((f) => !f.type || f.type.startsWith("image/"), {
      message: "Only images are allowed",
    })
    .optional(),
  userId: z.string(),
});


export const nameMailSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.email(),
  newsletter: z.string(),
});

export const changePwSchema = z
  .object({
    newpw: z.string().min(6).max(128),
    currpw: z.string().min(6).max(128),
    confirmPassword: z.string().min(6).max(128),
  })
  .superRefine((data, ctx) => {
    if (data.newpw !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords dont match.",
      });
    }
  });
