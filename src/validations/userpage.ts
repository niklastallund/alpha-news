import z from "zod";

// Safe fallback for server/import-time evaluation (when global File may be undefined)
const FileSchema = typeof File === "undefined" ? z.any() : z.instanceof(File);

export const nameMailSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.email(),
  newsletter: z.string(),
});

export const imageUploadSchema = z.object({
  file: FileSchema
    // Only run size validation in environments where File exists
    .superRefine((val, ctx) => {
      if (typeof File !== "undefined") {
        const file = val as File | undefined;
        if (file && file.size === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "No file!",
          });
        }
      }
    })
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
