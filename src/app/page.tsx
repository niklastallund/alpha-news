import Ticker from "@/components/ticker";
import Weather from "@/components/weather";
import Currency from "@/components/currency";
import { prisma } from "@/lib/prisma";
import ArticleCard from "@/components/ArticleCard";
import ContactCard from "@/components/contact";
import Page from "@/components/Page";

type Headline = { id: number; text?: string | undefined };
// Hämta 6 senaste artiklar för startsidan
export default async function Home() {
  const frontPageArticles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  // Derivera de 6 senaste rubrikerna från samma query
  const headlines: Headline[] = frontPageArticles
    .map((a) => ({ id: a.id, text: a.headline ?? undefined }))
    .filter((h) => Boolean(h.text))
    .slice(0, 6);

  return (
    <main className="px-4">
      <span className="inline-block background-primary text-sm font-semibold px-3 uppercase tracking-wide mb-1">
        live
      </span>
      {/* Skicka in sex senaste rubrikerna */}
      <Ticker headlines={headlines} />

      <Page>
        <div className="mt-10 flex flex-col lg:flex-row items-start justify-center gap-6">
          <div className="w-full md:max-w-3xl flex flex-col items-start gap-4 min-w-0">
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

          <aside className="w-full lg:max-w-sm flex flex-col justify-center items-start gap-4 min-w-0">
            <Weather />
            <Currency />
            <ContactCard />
          </aside>
        </div>
      </Page>
    </main>
  );
}
