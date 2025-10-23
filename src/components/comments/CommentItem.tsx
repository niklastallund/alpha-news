import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

// This component only takes the necessary props to render a comment item,
//  but you can send the whole comment and user objects to it and destructure them here
interface CommentProps {
  comment: {
    id: number;
    content: string;
    createdAt?: Date | string;
  };

  user: {
    id: string;
    name: string;
    image?: string;
    role?: string;
  };

  onLike?: (id: number) => void;
}

// helper: formats a Date or ISO string to a medium date + short time string
function formatDateTime(d?: Date | string) {
  if (!d) return "";
  return new Date(d).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function CommentItem({
  comment: { id, content, createdAt },
  user,
  onLike,
}: CommentProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="px-5 py-2">
        <div className="flex gap-5">
          <Avatar className="h-9 w-9">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : (
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">{user.name}</span>
                  {user.role && (
                    <span className="text-xs text-muted-foreground">
                      {user.role}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground"></span>
                </div>
              </div>
            </div>

            <ReactMarkdown>{content}</ReactMarkdown>

            {createdAt && (
              <div className="flex items-center text-sm space-x-3 mt-1">
                <div className="text-xs text-muted-foreground">
                  <time
                    dateTime={new Date(createdAt).toISOString()}
                    className="inline"
                  >
                    {formatDateTime(createdAt)}
                  </time>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
