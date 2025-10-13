import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getRole, getSessionData } from "@/lib/actions/sessiondata";

export type Params = {
  articleId: string;
};

export default async function ArticleDetailsPage(props: { params: Params }) {
  const session = await getSessionData();
  const isLoggedIn = !!session;
  const isAdmin = (await getRole()) === "admin";

  const params = await props.params;
  const articleId = parseInt(params.articleId);

  if (isNaN(articleId) || articleId <= 0) {
    return redirect("/articles");
  }

  // Fetch the article and include the genres and crew
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!article) {
    return notFound();
  }

  //We need to get the backdrop image here because it is not drawn in the component
  const backdropUrl =
    getBackdropUrl(movie.backdropPath, "w1280") || "/default-image.jpg";

  return (
    <main className="relative min-h-screen flex items-center justify-center">
      {/* Fullscreen Backdrop */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={backdropUrl}
          alt={`${movie.title} backdrop`}
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>
      {/* Transparent Card */}
      <MovieDetails
        movie={movie}
        genres={movie.genres}
        movieCrew={movie.movieCrew}
        allGenres={allGenres} // pass all genres to the details, used for editing
        isAdmin={isLoggedIn && isAdmin}
      />
    </main>
  );
}
