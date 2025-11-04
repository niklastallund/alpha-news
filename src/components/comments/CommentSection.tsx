import React from "react";
import { CommentItem } from "./CommentItem";
import { getSessionData } from "@/lib/actions/sessiondata";
import { CommentWithAuthor } from "../Article";
import CreateCommentForm from "./CreateCommentForm";

interface CommentSectionProps {
  comments: CommentWithAuthor[];
  articleId: number;
  articleAuthorIds: string[];
}

// This is the main comment section component that displays comments
// and the add comment form if the user is logged in.
export default async function CommentSection({
  comments,
  articleId,
  articleAuthorIds,
}: CommentSectionProps) {
  const session = await getSessionData();
  const isBanned = session?.user.banned ?? false;

  return (
    <div className="flex flex-col space-y-3 max-w-2xl">
      <h1 className="text-2xl">Comments</h1>
      {session && (
        <CreateCommentForm
          userId={session.user.id}
          articleId={articleId}
          isBanned={isBanned}
          banReason={session.user.banReason}
        />
      )}
      {comments.map((comment) => {
        // Determine if the comment author is also an author of the article
        const isArticleAuthor = articleAuthorIds.includes(comment.author.id);
        return (
          <CommentItem
            key={comment.id}
            comment={comment}
            user={comment.author}
            isUserTheAuthor={session?.user.id === comment.author?.id}
            isArticleAuthor={isArticleAuthor}
          />
        );
      })}
    </div>
  );
}
