import Ticker from "@/components/ticker";
import Weather from "../components/weather";
import Currency from "@/components/currency";
import { prisma } from "@/lib/prisma";
import ArticleCard from "@/components/ArticleCard";
import ContactCard from "@/components/contact";

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
        {/* Articles column: constrained width and aligned to start */}
        <div className="w-full md:max-w-3xl flex flex-col items-start gap-4">
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

        {/* Aside: give it a sensible max width and left-align items */}
        <aside className="w-full max-w-sm flex flex-col justify-center items-start gap-4">
          <Weather />
          <Currency />
          <ContactCard />
        </aside>
      </div>
    </main>
  );
}
