"use client";

import CreateArticleForm from "./CreateArticle";
import UpdateArticleDialog from "./UpdateArticleDialog";
import { DeleteArticleButton } from "./DeleteArticle";
import { useEffect, useState } from "react";
import { Category } from "@/generated/prisma/wasm";
import { getCats } from "@/lib/actions/createarticle";
import { ArticleWithCat, getArticles } from "@/lib/actions/createarticle";

export default function ArticleForms() {
  const [categories, setCategories] = useState<Category[]>();
  const [articles, setArticles] = useState<ArticleWithCat[]>();

  const [upd, setUpd] = useState<boolean>(true); // so passing this allows articles and categories to be refreshed.

  useEffect(() => {
    const getCategories = async () => {
      const cats = await getCats();

      if (cats) setCategories(cats);
      setUpd(false);
    };

    const getAllArticles = async () => {
      // Here we also could add filtering, i mean otherwise it will get alot of articles :P fix

      const arts: ArticleWithCat[] = await getArticles();
      if (arts) setArticles(arts);
    };

    if (upd) getCategories();

    if (upd) getAllArticles();
  }, [upd]);

  return (
    <div className="my-10 flex w-full justify-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left: Create form */}
          <div className="w-full lg:w-1/2">
            <CreateArticleForm categories={categories ?? []} setUpd={setUpd} />
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
                        {article.summary || "No summary"}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <UpdateArticleDialog
                        article={article}
                        currentCategories={article.category}
                        allCategories={categories ?? []}
                        setUpd={setUpd}
                      />
                      <DeleteArticleButton
                        articleId={article.id}
                        articleHeadline={article.headline}
                        setUpd={setUpd}
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
  );
}
