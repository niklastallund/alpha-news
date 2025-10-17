"use server";

import {
  CreateArticleInput,
  createArticleSchema,
  updateArticleCategoriesSchema,
  UpdateArticleInput,
  updateArticleSchema,
} from "@/validations/article-forms";
import { getRole } from "./sessiondata";
import { notFound } from "next/navigation";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

// Normalize category names: trim, collapse spaces, dedupe case-insensitive
// Parsing is already done on the front end, but just to be sure we don't get duplicates
function normalizeCategoryNames(names?: string[]) {
  if (!names?.length) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  names.forEach((n) => {
    const cleaned = (n || "").trim().replace(/\s+/g, " ");
    if (!cleaned) return;
    const key = cleaned.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(cleaned);
    }
  });
  return out;
}

export async function createArticle(formData: CreateArticleInput) {
  const role = await getRole();

  if (role !== "admin") return notFound();

  const validated = await createArticleSchema.parseAsync(formData);

  // Tobbe edits.
  // Normalize incoming category names, is already done on the front end but just to be sure.
  // const categories = normalizeCategoryNames(validated.categories);

  const categories = validated.categories;

  // Build connectOrCreate payload if there are categories
  const categoryConnectOrCreate =
    categories.length > 0
      ? categories.map((name) => ({
          where: { name },
          create: { name },
        }))
      : undefined;

  console.log(categoryConnectOrCreate);

  const article = await prisma.article.create({
    data: {
      headline: validated.headline,
      summary: validated.summary,
      content: validated.content,
      image: validated.image,
      editorsChoice: validated.editorsChoice,
      // Attach categories if provided. If the list is empty or undefined, do nothing.
      ...(categoryConnectOrCreate
        ? { category: { connectOrCreate: categoryConnectOrCreate } }
        : {}),
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

export async function updateArticleCategories(formData: FormData) {
  const role = await getRole();

  if (role !== "admin") return notFound();

  const articleIdRaw = formData.get("articleId");
  const selected = formData.getAll("categoryIds");

  // Convert to numbers
  const articleId = Number(articleIdRaw);
  const categoryIds = selected.map((v) => Number(v));

  // Validate with Zod
  const validated = await updateArticleCategoriesSchema.parseAsync({
    articleId,
    categoryIds,
  });

  await prisma.article.update({
    where: { id: validated.articleId },
    data: {
      category: {
        set: validated.categoryIds.map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/admin/article");
  return;
}
