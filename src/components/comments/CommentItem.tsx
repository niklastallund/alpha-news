"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import EditCommentForm from "./EditCommentForm";
import { DeleteCommentButton } from "./DeleteComment";
import { pickAvatarBg } from "@/lib/avatar-color";
import { formatDateTime, wasEdited } from "@/lib/date";

// This component only takes the necessary props to render a comment item,
// but you can send the whole comment and user objects to it and destructure them here
interface CommentProps {
  comment: {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
  };

  user: {
    id: string;
    name: string;
    image: string | null;
    role: string | null;
  };

  isAuthor: boolean;
}

export function CommentItem({
  comment: { id, content, createdAt, updatedAt },
  user,
  isAuthor,
}: CommentProps) {
  // Local state to manage editing mode + optimistic content
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(content);

  // Keep the draft in sync when the prop changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  // Called by the form immediately to show the optimistic content
  function handleOptimisticUpdate(newContent: string) {
    setLocalContent(newContent);
    setIsEditing(false);
  }

  // Called by the form if server save failed and we need to revert.
  // Restore the draft into the editor so the user doesn't lose what they typed.
  // If draftContent is undefined/null, revert to prevContent.
  // draftContent = user's draft when they submitted
  // prevContent = last committed value from props
  function handleOptimisticError(prevContent: string, draftContent: string) {
    setLocalContent(draftContent ?? prevContent);
    setIsEditing(true);
  }

  return (
    <Card className="shadow-sm">
      {/* make CardContent relative so we can absolutely position the controls */}
      <CardContent className="px-5 py-2 relative">
        <div className="flex gap-5">
          <Avatar className="h-9 w-9">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : (
              <AvatarFallback
                className={`${pickAvatarBg(user.name)} text-white select-none `}
              >
                {user.name[0]}
              </AvatarFallback>
            )}
          </Avatar>

          {/* Commenter name and role */}
          <div className="flex-1">
            {/* name + role (no justify-between) */}
            <div className="flex items-center gap-2">
              <span className="text-md font-medium">{user.name}</span>
              {user.role && (
                <span className="text-xs text-muted-foreground">
                  {user.role}
                </span>
              )}
            </div>

            {/* Comment content (editable when isEditing) */}
            <div className="my-3">
              {isEditing ? (
                <EditCommentForm
                  initialContent={localContent}
                  commentId={id}
                  userId={user.id}
                  onCancel={() => {
                    // revert the draft to the last committed prop value
                    setIsEditing(false);
                    setLocalContent(content);
                  }}
                  // optimistic callbacks
                  onOptimisticUpdate={(newContent) => {
                    handleOptimisticUpdate(newContent);
                  }}
                  onError={(prev, draft) => {
                    handleOptimisticError(prev, draft);
                  }}
                />
              ) : (
                <div className="prose prose-sm dark:prose-invert">
                  <ReactMarkdown>{localContent}</ReactMarkdown>
                </div>
              )}
            </div>

            {/* Comment metadata */}
            <div className=" block text-xs text-muted-foreground">
              {formatDateTime(createdAt)}
              {wasEdited(createdAt, updatedAt) && (
                <span className="ml-2 text-xs italic text-muted-foreground">
                  Edited {formatDateTime(updatedAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* bottom-right controls for author (absolute to CardContent) */}
        {isAuthor && !isEditing && (
          <div className="absolute right-4 bottom-3 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              Edit
            </Button>

            <DeleteCommentButton commentId={id} userId={user.id} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
