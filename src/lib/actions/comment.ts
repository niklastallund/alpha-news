"use server";

import {
  CreateCommentInput,
  createCommentSchema,
  EditCommentInput,
  editCommentSchema,
} from "@/validations/comment-forms";
import { prisma } from "../prisma";
import { getSessionData } from "./sessiondata";

export async function createComment(formData: CreateCommentInput) {
  const session = await getSessionData();

  // Only allow if the user is logged in and is the same as userId
  if (!session || session.user.id !== formData.userId) {
    return;
  }

  const validated = await createCommentSchema.parseAsync(formData);

  const comment = await prisma.comment.create({
    data: {
      content: validated.content,
      article: { connect: { id: validated.articleId } },
      author: { connect: { id: validated.userId } },
    },
  });

  return comment;
}

export async function editComment(formData: EditCommentInput) {
  const session = await getSessionData();

  // Only allow if the user is logged in and is the same as userId
  if (!session || session.user.id !== formData.userId) {
    return;
  }

  const validated = await editCommentSchema.parseAsync(formData);

  const comment = await prisma.comment.update({
    where: { id: validated.commentId },
    data: { content: validated.content },
  });

  return comment;
}

export async function deleteComment(id: number, userId: string) {
  const session = await getSessionData();

  if (!session || session.user.id !== userId) {
    return;
  }

  await prisma.comment.delete({
    where: { id },
  });
}
