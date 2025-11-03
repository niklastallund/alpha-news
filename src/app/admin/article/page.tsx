import Page from "@/components/Page";

import { getArticles, getCats } from "@/lib/actions/article";
import CreateArticleForm from "./forms/CreateArticle";
import UpdateArticleDialog from "./forms/UpdateArticleDialog";
import { DeleteArticleButton } from "./forms/DeleteArticle";
import { getSessionData } from "@/lib/actions/sessiondata";
import { notFound } from "next/navigation";

export default async function AdminArticlePage() {
  const session = await getSessionData();

  if (!session || session.user.role !== "admin") {
    return notFound();
  }

  const articles = await getArticles();
  const categories = await getCats();

  return (
    <Page>
      <div className="my-10 flex w-full justify-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left: Create form */}
            <div className="w-full lg:w-1/2">
              <CreateArticleForm categories={categories} />
            </div>
            {/* Right: Articles list */}
            <div className="w-full lg:w-1/2">
              {articles && articles.length > 0 ? (
                <ul className="space-y-3">
                  {articles.map((article) => (
                    <li
                      key={article.id}
                      className="flex items-start justify-between rounded-xl border bg-card p-4 shadow-sm"
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <h3 className="font-medium truncate">
                          {article.headline || "Untitled"}
                        </h3>
                        <p className="text-sm text-muted-foreground italic truncate">
                          {`Editor's choice: ${article.editorsChoice}`}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <UpdateArticleDialog
                          article={article}
                          currentCategories={article.category}
                          allCategories={categories ?? []}
                        />
                        <DeleteArticleButton
                          articleId={article.id}
                          articleHeadline={article.headline}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No articles found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
