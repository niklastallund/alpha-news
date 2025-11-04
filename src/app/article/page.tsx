import ArticleCard from "@/components/ArticleCard";
import CategoryFilter from "@/components/filtering/CategoryFilter";
import EditorsChoiceToggle from "@/components/filtering/EditorsChoiceToggle";
import Page from "@/components/Page";
import SearchBar from "@/components/filtering/SearchBar";
import { prisma } from "@/lib/prisma";

// This page displays the all the articles according to the search query and filters.
export default async function ArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; editors?: string }>;
}) {
  // Get the search params to filter articles
  const params = await searchParams;
  const query = params.q || "";
  const selectedCategory = params.cat || "";
  const editorsOnly = params.editors === "1";

  // Fetch articles from the database based on the search query and filters
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
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
      ...(editorsOnly ? { editorsChoice: true } : {}),
    },
  });

  // Fetch all categories for the category filter
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <Page>
      {/* Controls row — same width as ArticleCard */}
      <div className="mx-auto w-full max-w-3xl mb-4">
        {/* Stack on small screens, row on sm+ */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Search should be full width on small screens, take remaining space on larger */}
          <div className="w-full sm:flex-1">
            <SearchBar placeholder="Search for articles..." />
          </div>

          {/* Keep filters from shrinking too small */}
          <div className="flex items-center gap-2 sm:shrink-0">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
            />
            <EditorsChoiceToggle />
          </div>
        </div>
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
