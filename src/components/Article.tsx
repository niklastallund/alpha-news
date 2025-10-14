"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Separator } from "./ui/separator";

interface ArticleProps {
  headline?: string;
  summary?: string;
  content?: string;
  image?: string;
  editorsChoice?: boolean;
}

export default function Article({
  headline,
  summary,
  content,
  image,
  editorsChoice,
}: ArticleProps) {
  return (
    <div className="flex">
      <article className="prose lg:prose-lg">
        <div className="mr-4">
          {image && (
            <Image
              src={image}
              alt={"null"}
              width={1000}
              height={1000}
              className="min-w-xl"
            />
          )}
        </div>
        <ReactMarkdown>{headline}</ReactMarkdown>
        <div className="italic">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
        <Separator className="my-4" />
        <ReactMarkdown>{content}</ReactMarkdown>
        {editorsChoice && (
          <p className="mt-4 text-sm italic text-green-600">
            {`Editor's Choice: ${editorsChoice}`}
          </p>
        )}
      </article>
    </div>
  );
}
