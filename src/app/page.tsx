import Ticker from "@/components/ticker";
import Weather from "../components/weather";
import Currency from "@/components/currency";
import { prisma } from "@/lib/prisma";
import ArticleCard from "@/components/ArticleCard";

export default async function Home() {
  const frontPageArticles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <main className="p-2">
      <span className="inline-block bg-red-600 text-white text-sm font-semibold px-3 py-1 uppercase tracking-wide mb-1">
        live
      </span>
      <Ticker />

      {/* Container: stacks on small screens, side-by-side on md+ */}
      <div className="mt-5 flex flex-col lg:flex-row items-start justify-center gap-6">
        {/* Articles column: constrained width and centered on the page */}
        <div className="w-full md:max-w-3xl flex flex-col items-center md:items-start gap-4">
          {frontPageArticles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              image={article.image ?? undefined}
              headline={article.headline ?? undefined}
              editorsChoice={article.editorsChoice}
            />
          ))}
        </div>

        {/* Aside: fixed width on md+, full width on small screens */}
        <aside className="w-full md:w-sm flex flex-col justify-center items-end gap-4">
          <Weather />
          <Currency />
        </aside>
      </div>
    </main>
  );
}
