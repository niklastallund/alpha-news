"use server";

import {
  CreateArticleInput,
  createArticleSchema,
} from "@/validations/article-forms";
import { getRole } from "./sessiondata";
import { notFound } from "next/navigation";
import { prisma } from "../prisma";

export async function createArticle(formData: CreateArticleInput) {
  const role = await getRole();

  if (role !== "admin") return notFound();

  const validated = await createArticleSchema.parseAsync(formData);

  const article = await prisma.article.create({
    data: {
      headline: validated.headline,
      summary: validated.summary,
      content: validated.content,
      image: validated.image,
      editorsChoice: validated.editorsChoice,
    },
  });

  return article;
}
