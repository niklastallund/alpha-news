"use server";

import {
  CreateCategoryInput,
  createCategorySchema,
  UpdateCategoryInput,
  updateCategorySchema,
} from "@/validations/category-forms";
import { getSessionData } from "./sessiondata";
import { notFound } from "next/navigation";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";

export async function createCategory(formData: CreateCategoryInput) {
  const session = await getSessionData();
  const authorId = session?.user?.id;

  const data = await auth.api.userHasPermission({
    body: {
      userId: authorId,
      permission: { project: ["create"] },
    },
  });

  if (!data.success) {
    return notFound();
  }

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
  const session = await getSessionData();
  const authorId = session?.user?.id;

  const data = await auth.api.userHasPermission({
    body: {
      userId: authorId,
      permission: { project: ["update"] },
    },
  });

  if (!data.success) {
    return notFound();
  }

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

export async function deleteCategory(id: number) {
  const session = await getSessionData();
  const authorId = session?.user?.id;

  const data = await auth.api.userHasPermission({
    body: {
      userId: authorId,
      permission: { project: ["delete"] },
    },
  });

  if (!data.success) {
    return notFound();
  }

  const category = await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/admin/category");
  return category;
}
