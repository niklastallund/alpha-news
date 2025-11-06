import z from "zod";

const FileLikeSchema = z
  .object({
    size: z.number().int().nonnegative(),
    type: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
  })
  .passthrough();

const BlobSchema = z.custom<Blob>(
  (v) => typeof Blob !== "undefined" && v instanceof Blob,
  { message: "Expected a File/Blob" }
);

const AnyFileSchema = z.union([BlobSchema, FileLikeSchema]);

export const imageUploadSchema = z.object({
  file: AnyFileSchema
    .superRefine((f, ctx) => {
      if (!f) return;
      const size = f instanceof Blob ? f.size : f.size;
      const type = f instanceof Blob ? f.type : f.type;
      if (!size || size <= 0) {
        ctx.addIssue({ code: "custom", message: "No file!" });
      }
      if (size > 5 * 1024 * 1024) {
        ctx.addIssue({ code: "custom", message: "File too large (max 5MB)" });
      }
      if (type && !type.startsWith("image/")) {
        ctx.addIssue({ code: "custom", message: "Only images are allowed" });
      }
    })
    .optional(),
  userId: z.string(),
});

export const nameMailSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email(),
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
        message: "Passwords don't match.",
      });
    }
  });