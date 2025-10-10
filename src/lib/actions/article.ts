"use server";

import {
  CreateArticleInput,
  createArticleSchema,
  UpdateArticleInput,
  updateArticleSchema,
} from "@/validations/article-forms";
import { getRole } from "./sessiondata";
import { notFound } from "next/navigation";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

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

  revalidatePath("/admin/article");
  return article;
}

export async function updateArticle(formData: UpdateArticleInput) {
  const role = await getRole();

  if (role !== "admin") return notFound();

  const validated = await updateArticleSchema.parseAsync(formData);

  const article = await prisma.article.update({
    where: { id: validated.id },
    data: {
      headline: validated.headline,
      summary: validated.summary,
      content: validated.content,
      image: validated.image,
      editorsChoice: validated.editorsChoice,
    },
  });

  revalidatePath("/admin/article");
  return article;
}

export async function deleteArticle(id: number) {
  const role = await getRole();

  if (role !== "admin") return notFound();

  const article = await prisma.article.delete({
    where: { id },
  });

  revalidatePath("/admin/article");
  return article;
}
