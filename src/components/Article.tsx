"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { defaultSchema } from "hast-util-sanitize";
import { Separator } from "./ui/separator";

interface ArticleProps {
  headline?: string;
  summary?: string;
  content?: string;
  image?: string;
  editorsChoice?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  author: string;
}

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), "u"],
  attributes: {
    ...defaultSchema.attributes,
    u: [],
  },
};

// helper: formats a Date to a medium date + short time string
function formatDateTime(d?: Date) {
  if (!d) return "";
  return new Date(d).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function Article({
  headline,
  summary,
  content,
  image,
  editorsChoice,
  createdAt,
  updatedAt,
  author,
}: ArticleProps) {
  return (
    <div className="flex my-10">
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

        <h1>{headline}</h1>

        {(createdAt || updatedAt) && (
          <div className="flex items-center text-sm space-x-3">
            {createdAt && (
              <time
                dateTime={new Date(createdAt).toISOString()}
                className="inline"
              >
                {`Created: ${formatDateTime(createdAt)}`}
              </time>
            )}
            {createdAt && updatedAt && (
              <span className="text-muted-foreground">•</span>
            )}
            {updatedAt && (
              <time
                dateTime={new Date(updatedAt).toISOString()}
                className="inline text-muted-foreground"
              >
                {`Updated: ${formatDateTime(updatedAt)}`}
              </time>
            )}
          </div>
        )}
        {/* Summary in bold */}
        <p className="font-bold whitespace-pre-line">{summary || ""}</p>
        <Separator className="my-4" />

        {/* Render markdown content */}
        <ReactMarkdown
          rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
        >
          {content || ""}
        </ReactMarkdown>
        {author && (
          <p className="mt-4 text-sm italic text-muted-foreground">{`By ${author}`}</p>
        )}
        {editorsChoice && (
          <p className="mt-4 text-sm italic text-green-600">
            {`This article has been marked as exceptional by the editors.`}
          </p>
        )}
      </article>
    </div>
  );
}
