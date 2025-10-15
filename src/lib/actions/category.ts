"use server";

import {
  CreateCategoryInput,
  createCategorySchema,
  UpdateCategoryInput,
  updateCategorySchema,
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

export async function updateCategory(formData: UpdateCategoryInput) {
  const role = await getRole();

  if (role !== "admin") return notFound();

  const validated = await updateCategorySchema.parseAsync(formData);

  const category = await prisma.category.update({
    where: { id: validated.id },
    data: {
      name: validated.name,
      onNavbar: validated.onNavbar,
    },
  });

  revalidatePath("/admin/category");
  return category;
}
