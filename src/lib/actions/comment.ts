"use server";

import {
  CreateCommentInput,
  createCommentSchema,
} from "@/validations/comment-forms";
import { prisma } from "../prisma";
import { getSessionData } from "./sessiondata";

export async function createComment(formData: CreateCommentInput) {
  const session = await getSessionData();

  // Only allow if the user is logged in and is the same as userId (to prevent spoofing)
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
