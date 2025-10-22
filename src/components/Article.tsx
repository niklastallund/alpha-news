"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { defaultSchema } from "hast-util-sanitize";
import { Separator } from "./ui/separator";
import { LibraryBig, PencilLine, ThumbsUp } from "lucide-react";

interface ArticleProps {
  headline?: string;
  summary?: string;
  content?: string;
  image?: string;
  editorsChoice?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  categories?: string[];
  authors?: string[];
}

// Extend the default sanitize schema to allow <u> tags
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
  categories = [],
  authors = [],
}: ArticleProps) {
  return (
    <div className="flex">
      <article className="prose dark:prose-invert lg:prose-lg">
        {image && (
          <Image
            src={image}
            alt={"null"}
            width={1000}
            height={1000}
            className="min-w-xl object-cover rounded-xs"
          />
        )}

        <h1>{headline}</h1>

        {categories.length > 0 && (
          <p className="mt-4 text-sm italic text-muted-foreground">
            <span className="flex items-center">
              <LibraryBig size={16} className="mr-1" />
              {categories.join(", ")}
            </span>
          </p>
        )}
        {editorsChoice && (
          <p className="text-sm italic text-green-600">
            <span className="flex items-center">
              <ThumbsUp size={16} className="mr-1" />
              {`Editor's choice.`}
            </span>
          </p>
        )}

        {/* Created and updated timestamps */}
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
        {/* Categories */}

        {authors.length > 0 && (
          <p className="mt-4 text-sm italic text-muted-foreground">
            <span className="flex items-center">
              <PencilLine size={16} className="mr-1" />
              {`Written by ${authors.join(", ")}`}
            </span>
          </p>
        )}
        <Separator className="my-4" />

        {/* Render markdown content */}
        <ReactMarkdown
          rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
        >
          {content || ""}
        </ReactMarkdown>
      </article>
    </div>
  );
}
