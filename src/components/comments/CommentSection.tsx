import React, { useState } from "react";
import { CommentItem } from "./CommentItem";

type TempUser = {
  id: string;
  name: string;
  image?: string;
  role?: string;
};

type TempComment = {
  id: number;
  content: string;
  createdAt: string;
  user: TempUser;
};

const TEMP_COMMENTS: TempComment[] = [
  {
    id: 1,
    content: "Great article — learned a lot. Thanks!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    user: { id: "u1", name: "Alice Johnson", image: "", role: "Reader" },
  },
  {
    id: 2,
    content:
      "I disagree with some points, but overall well written.I disagree with some points, but overall well written. I disagree with some points, but overall well written.I disagree with some points, but overall well written. I disagree with some points, but overall well written. ",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    user: { id: "u2", name: "Bob Smith", image: "", role: "Subscriber" },
  },
  {
    id: 3,
    content: "Can someone explain the second paragraph?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    user: { id: "u3", name: "Charlie", image: "", role: "" },
  },
  {
    id: 4,
    content: "Nice write-up. Saved for later.",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    user: { id: "u4", name: "Dana K", image: "", role: "Editor" },
  },
  {
    id: 5,
    content: "Proofreading note: a typo in the last sentence.",
    createdAt: new Date().toISOString(),
    user: { id: "u5", name: "Eve", image: "", role: "Contributor" },
  },
];

export default function CommentSection() {
  const [comments] = useState(TEMP_COMMENTS);

  return (
    <div className="flex flex-col mt-8 space-y-3 max-w-2xl">
      {comments.map((c) => (
        <CommentItem
          key={c.id}
          comment={{ id: c.id, content: c.content, createdAt: c.createdAt }}
          user={c.user}
          onLike={(id) => console.log("like:", id)}
        />
      ))}
    </div>
  );
}
