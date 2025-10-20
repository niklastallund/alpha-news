import ArticleCard from "@/components/ArticleCard";
import Page from "@/components/Page";
import SearchBar from "@/components/SearchBar";
import { prisma } from "@/lib/prisma";

// This page displays the all the articles according to the search query and filters.
export default async function ArticlePage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  // Get the search params to filter articles
  const params = await searchParams;
  const query = params.q || "";

  // Fetch articles from the database based on the search query
  const articles = await prisma.article.findMany({
    where: {
      headline: {
        contains: query,
        mode: "insensitive",
      },
    },
  });

  return (
    <Page>
      <SearchBar />
      <ul>
        {/*TODO: Replace this list with actual article rendering */}
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            image={article.image ?? undefined}
            headline={article.headline ?? undefined}
          />
        ))}
      </ul>
    </Page>
  );
}
