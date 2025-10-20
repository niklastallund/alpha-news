import Image from "next/image";
import Link from "next/link";
import { Card, CardTitle, CardContent } from "@/components/ui/card";

interface ArticleCardProps {
  id: number;
  headline?: string;
  image?: string;
}

// This components displays a summary card for a given article.
// Used on the /article page to list articles.
export default function ArticleCard({ id, headline, image }: ArticleCardProps) {
  return (
    <Card className="mx-auto w-full max-w-3xl group">
      <Link href={`/article/${id}`} passHref>
        {image && (
          <div className="w-full px-6">
            <div className="relative w-full aspect-[6/3] overflow-hidden rounded-md mb-2">
              <Image
                src={image}
                alt={headline ?? "article image"}
                fill
                // Adjust sizes as needed depending on screen size
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          </div>
        )}

        <CardContent>
          <CardTitle className="text-3xl md:text-4xl font-bold leading-tight mt-0 mb-0 group-hover:underline">
            {headline}
          </CardTitle>
        </CardContent>
      </Link>
    </Card>
  );
}
