"use server";

import {
  CreateCategoryInput,
  createCategorySchema,
} from "@/validations/category-forms";
import { getRole } from "./sessiondata";
import { notFound } from "next/navigation";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: CreateCategoryInput) {
  const role = await getRole();

  if (role !== "admin") return notFound();

  const validated = await createCategorySchema.parseAsync(formData);

  const category = await prisma.category.create({
    data: {
      name: validated.name,
      onNavbar: validated.onNavbar,
    },
  });

  revalidatePath("/admin/category");
  return category;
}
