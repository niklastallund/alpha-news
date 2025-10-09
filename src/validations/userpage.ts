import z from "zod";

export const nameMailSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.email(),
});

export const imageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, "No file!")
    .optional(),
  userId: z.string(),
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
