"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

// Background colors for avatar placeholders
const AVATAR_BG = [
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-lime-600",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-sky-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-pink-500",
];

// Picks a background color based on a string seed (name in this case)
// to ensure consistent colors for the same user
function pickAvatarBg(seed?: string) {
  if (!seed) return "bg-gray-400";
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return AVATAR_BG[Math.abs(hash) % AVATAR_BG.length];
}

// helper: formats a Date or ISO string to a medium date + short time string
function formatDateTime(d?: Date) {
  if (!d) return "";
  return new Date(d).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// This component only takes the necessary props to render a comment item,
// but you can send the whole comment and user objects to it and destructure them here
interface CommentProps {
  comment: {
    id: number;
    content: string;
    createdAt: Date;
  };

  user: {
    id: string;
    name: string;
    image?: string;
    role?: string;
  };

  onLike?: (id: number) => void;
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
              <AvatarFallback
                className={`${pickAvatarBg(user.name)} text-white select-none `}
              >
                {user.name[0]}
              </AvatarFallback>
            )}
          </Avatar>

          {/* Commenter name and role */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">{user.name}</span>
              {user.role && (
                <span className="text-xs text-muted-foreground">
                  {user.role}
                </span>
              )}
            </div>

            {/* Comment content */}
            <ReactMarkdown>{content}</ReactMarkdown>

            {/* Comment metadata */}
            <div className="mt-1 block text-xs text-muted-foreground">
              {formatDateTime(createdAt)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
