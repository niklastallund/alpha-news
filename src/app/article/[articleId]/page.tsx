import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Article from "@/components/Article";
import Page from "@/components/Page";

export type Params = {
  articleId: string;
};

export default async function ArticleDetailsPage(props: { params: Params }) {
  const params = await props.params;
  const articleId = parseInt(params.articleId);

  if (isNaN(articleId) || articleId <= 0) {
    return redirect("/articles");
  }

  // Fetch the article and include the related category and author names
  // plus any comments written on the article.
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      category: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          name: true,
        },
      },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: true,
        },
      },
    },
  });

  if (!article) {
    return notFound();
  }

  return (
    <Page>
      <main className="relative flex items-center justify-center mt-5">
        <Article
          id={article.id}
          headline={article.headline ?? undefined}
          summary={article.summary ?? undefined}
          content={article.content ?? undefined}
          image={article.image ?? undefined}
          editorsChoice={article.editorsChoice ?? undefined}
          createdAt={article.createdAt}
          updatedAt={article.updatedAt}
          categories={article.category.map((cat) => cat.name)}
          authors={article.author.map((auth) => auth.name)}
          comments={article.comments}
        />
      </main>
    </Page>
  );
}
