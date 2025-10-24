import React from "react";
import { CommentItem } from "./CommentItem";
import { getSessionData } from "@/lib/actions/sessiondata";
import { CommentWithAuthor } from "../Article";
import CreateCommentForm from "./CreateCommentForm";

interface CommentSectionProps {
  comments: CommentWithAuthor[];
  articleId: number;
}

// This is the main comment section component that displays comments
// and the add comment form if the user is logged in.
export default async function CommentSection({
  comments,
  articleId,
}: CommentSectionProps) {
  const session = await getSessionData();

  return (
    <div className="flex flex-col space-y-3 max-w-2xl">
      <h1 className="text-2xl">Comments</h1>
      {session && (
        <CreateCommentForm userId={session.user.id} articleId={articleId} />
      )}
      {comments.map((comment) => {
        return (
          <CommentItem
            key={comment.id}
            comment={comment}
            user={comment.author}
            isAuthor={session?.user.id === comment.author?.id}
          />
        );
      })}
    </div>
  );
}
