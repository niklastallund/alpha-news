import ArticleCard from "@/components/ArticleCard";
import CategoryFilter from "@/components/CategoryFilter";
import Page from "@/components/Page";
import SearchBar from "@/components/SearchBar";
import { prisma } from "@/lib/prisma";

// This page displays the all the articles according to the search query and filters.
export default async function ArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  // Get the search params to filter articles
  const params = await searchParams;
  const query = params.q || "";
  const selectedCategory = params.cat || "";

  // Fetch articles from the database based on the search query
  const articles = await prisma.article.findMany({
    where: {
      headline: {
        contains: query,
        mode: "insensitive",
      },
      ...(selectedCategory
        ? {
            category: {
              some: { name: selectedCategory },
            },
          }
        : {}),
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <Page>
      <div className="flex mb-4 justify-center max-w-full lg:max-w-1/2 gap-4">
        <SearchBar />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
        />
      </div>
      <div className="flex flex-col items-center gap-4">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            id={article.id}
            image={article.image ?? undefined}
            headline={article.headline ?? undefined}
            editorsChoice={article.editorsChoice}
          />
        ))}
      </div>
    </Page>
  );
}
