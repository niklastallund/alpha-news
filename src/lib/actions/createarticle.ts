"use server";

// So here i will put all that stuff, maybe the ai too?

import Article from "@/components/Article";
import { prisma } from "../prisma";

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
    console.log("Getting articles...");
    const articles = await prisma.article.findMany({
      orderBy: { updatedAt: "desc" },
      include: { category: true },
    });

    console.log(JSON.stringify(articles));

    return articles;
  } catch (e) {
    console.log("Error fetching articles! " + JSON.stringify(e));
    return [];
  }
}

import { Category } from "@/generated/prisma/wasm";
import { addCategorySchema } from "@/validations/article-forms";
import { ResultPatternType } from "@/app/ai/ai";

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
