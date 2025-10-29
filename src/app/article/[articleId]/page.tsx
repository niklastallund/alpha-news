import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Article from "@/components/Article";
import Page from "@/components/Page";
import { auth } from "@/lib/auth";
import { getRole, getSessionData, getSub } from "@/lib/actions/sessiondata";
import Subscribe from "@/components/Subscribe";

export type Params = {
  articleId: string;
};

export default async function ArticleDetailsPage(props: { params: Params }) {
  const params = await props.params;
  const articleId = parseInt(params.articleId);

  const sessionData = await getSessionData();
  const user = sessionData?.user;
  const role = await getRole();
  const sub = await getSub();

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
          id: true,
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

  let needSub: boolean = false;
  if (
    article?.onlyFor &&
    article.onlyFor !== sub?.plan &&
    sub?.plan !== "pro"
  ) {
    // Check if admin, or the author

    const isAuthor = !!article.author.find(
      (au) => au.id === sessionData?.user.id
    );

    if (!isAuthor && role !== "admin") needSub = true; // Fix: subscribe sida kanske? :)
  }

  if (!article) {
    return notFound();
  }

  return (
    <Page>
      <main className="relative flex items-center justify-center mt-5">
        {needSub ? (
          <div>
            <span className="font-xl">Only for subscribers.</span>
            <br />
            <br />
            You need to subscribe to the plan {article.onlyFor} to see this
            article.
            <br />
            <br />
            {sessionData?.user.id && <Subscribe></Subscribe>}
          </div>
        ) : (
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
        )}
      </main>
    </Page>
  );
}
