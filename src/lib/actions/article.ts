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
// function normalizeCategoryNames(names?: string[]) {
//   if (!names?.length) return [];
//   const seen = new Set<string>();
//   const out: string[] = [];
//   names.forEach((n) => {
//     const cleaned = (n || "").trim().replace(/\s+/g, " ");
//     if (!cleaned) return;
//     const key = cleaned.toLowerCase();
//     if (!seen.has(key)) {
//       seen.add(key);
//       out.push(cleaned);
//     }
//   });
//   return out;
// }

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

// So here i will put all that stuff, maybe the ai too?
// Well no, maybe move this to article.ts ? fix

export type ArticleWithCat = {
  category: {
    name: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    onNavbar: boolean;
  }[];
} & {
  id: number;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  headline: string | null;
  summary: string | null;
  content: string | null;
  editorsChoice: boolean;
  views: number;
};

export async function getArticles(): Promise<ArticleWithCat[]> {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { updatedAt: "desc" },
      include: { category: true },
    });

    return articles;
  } catch (e) {
    console.log("Error fetching articles! " + JSON.stringify(e));
    return [];
  }
}

import { Category } from "@/generated/prisma/wasm";
import { addCategorySchema } from "@/validations/article-forms";
import { ResultPatternType } from "@/lib/actions/ai";

// Maybe move this to another server-action? fix
export async function getCats(): Promise<Category[]> {
  const cats: Category[] = await prisma.category.findMany();

  return cats;
}

export async function addCat(
  cat: string
): Promise<ResultPatternType<Category>> {
  // First check if exist:

  try {
    const parsedName = await addCategorySchema.parseAsync({ name: cat });
    if (!parsedName) throw new Error("Invalid name, could not parse.");

    const tryToFind = await prisma.category.findFirst({
      where: {
        name: {
          contains: cat,
          mode: "insensitive",
        },
      },
    });

    if (tryToFind)
      return {
        success: false,
        msg:
          "Category " +
          tryToFind.name +
          " is already in db with id " +
          tryToFind.id,
      };

    // So this is called from another place so the binding is not here, here we only make sure its in db.
    const addedCat = await prisma.category.create({
      data: {
        name: cat,
      },
    });

    return { success: true, data: addedCat };
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);

    return {
      success: false,
      msg: "Add category failed. " + String(errorMsg),
    };
  }
}
