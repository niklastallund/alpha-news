import { ResultPatternType } from "@/lib/actions/ai";
import z from "zod";

// So this type contains all sent mail and there result. Good if we want to list it all to se how it went :)
export type sentNLMailsReturnType = {
  to: string;
  data: ResultPatternType<string>;
}[];

export const newsletterMailSchema = z.object({
  subject: z.string(),
  mdtext: z.string(),
});

export const newsletterMailSendSchema = z.object({
  to: z.string(),
  subject: z.string(),
  mdtext: z.string(),
});

export const newsLetterSchema = z.object({
  headline: z.string(),
  content: z.string(),
});
