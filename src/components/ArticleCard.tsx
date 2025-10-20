
import Image from "next/image";

interface ArticleCardProps {
  headline?: string;
  image?: string;
}

// This components displays a summary card for a given article.
// Used on the /article page to list articles.
export default function ArticleCard({ headline, image }: ArticleCardProps) {
  {
    return (
      <div>
        {image && (
          <Image
            src={image}
            alt={"null"}
            width={1000}
            height={1000}
            className="min-w-xl"
          />
        )}
        <article className="prose lg:prose-lg">
          <h2>{headline}</h2>
        </article>
      </div>
    );
  }
}
