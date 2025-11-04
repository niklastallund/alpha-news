import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { defaultSchema } from "hast-util-sanitize";
import { Separator } from "./ui/separator";
import { LibraryBig, PencilLine, ThumbsUp } from "lucide-react";
import { Prisma } from "@/generated/prisma";
import CommentSection from "./comments/CommentSection";
import { wasEdited } from "@/lib/date";

// Export type for comments with author info, used in child components
export type CommentWithAuthor = Prisma.CommentGetPayload<{
  include: {
    author: { select: { id: true; name: true; image: true; role: true } };
  };
}>;

interface ArticleProps {
  id: number;
  headline?: string;
  summary?: string;
  content?: string;
  image?: string;
  editorsChoice?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  categories?: string[];
  authors?: string[];
  comments?: CommentWithAuthor[];
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
  id,
  headline,
  summary,
  content,
  image,
  editorsChoice,
  createdAt,
  updatedAt,
  categories = [],
  authors = [],
  comments = [],
}: ArticleProps) {
  return (
    <div className="flex flex-col lg:min-w-1/2 min-w-full">
      <article className="prose dark:prose-invert lg:prose-lg">
        <h1 className="mb-4!">{headline}</h1>

        {/* Categories and editor's choice, show on one line if both exist */}
        {(categories.length > 0 || editorsChoice) && (
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm italic text-muted-foreground min-w-0">
              <span className="flex items-center min-w-0">
                <LibraryBig size={16} className="mr-1 shrink-0" />
                <span className="truncate" title={categories.join(", ")}>
                  {categories.join(", ")}
                </span>
              </span>
            </p>

            {editorsChoice && (
              <p className="text-sm italic text-green-600 shrink-0">
                <span className="flex items-center">
                  <ThumbsUp size={16} className="mr-1" />
                  {`Editor's choice.`}
                </span>
              </p>
            )}
          </div>
        )}

        {image && (
          <Image
            src={image}
            alt={"null"}
            width={1000}
            height={1000}
            className="mt-4! object-cover rounded-xs"
          />
        )}

        {/* Summary in bold */}
        <p className="font-bold whitespace-pre-line">{summary || ""}</p>

        {/* Created and updated timestamps */}
        <div className="flex items-center text-sm space-x-3">
          {createdAt && (
            <p className="inline">{`Created: ${formatDateTime(createdAt)}`}</p>
          )}
          {wasEdited(createdAt, updatedAt) && (
            <p className="inline text-muted-foreground">
              {`Updated: ${formatDateTime(updatedAt)}`}
            </p>
          )}
        </div>

        {/* Authors */}
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
      <Separator className="my-6" />
      <CommentSection comments={comments} articleId={id} />
    </div>
  );
}
