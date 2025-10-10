import Page from "@/components/Page";
import CreateArticleForm from "./forms/CreateArticle";
import { prisma } from "@/lib/prisma";

export default async function AdminArticlePage() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: "asc" },
  });

  return (
    <Page>
      <div className="flex flex-col justify-center items-center my-10 gap-4">
        <CreateArticleForm />
      </div>
    </Page>
  );
}
