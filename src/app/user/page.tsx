// So this is the landingpage for the user after signing in, or clicked on user in nav.
// Here the user can see its role, change profilepic, details and password.

import Page from "@/components/Page";
import { getSessionData } from "@/lib/actions/sessiondata";
import { redirect } from "next/navigation";
import React from "react";
import UserPic from "./UserPic";
import ImageUploader from "./ImageUploader";
import PasswordForm from "./PasswordForm";
import NameForm from "./NameForm";
import { prisma } from "@/lib/prisma";

export default async function UserPage() {
  const session = await getSessionData();

  if (!session) redirect("/");

  const getUserData = async () => {
    const articles = await prisma.article.findMany({
      where: { author: { some: { id: session.user.id } } },
    });

    const comments = await prisma.comment.findMany({
      where: { authorId: session.user.id },
      include: { article: true },
    });

    return { articles, comments };
  };

  const userData = await getUserData();

  return (
    <Page>
      <div className="w-full md:grid md:grid-cols-2 lg:grid-cols-3 gap-2">
        <div className="p-2 md:col-span-2 lg:col-span-3 md:flex md:flex-wrap md:gap-2 md:items-end">
          <UserPic></UserPic>

          <div>
            <span className="text-4xl">{session.user.name}</span>
            <br />
            <span className="text-xl font-bold">{session.user.email}</span>
            <br />
          </div>
        </div>

        <div className="p-2">
          <ImageUploader />
        </div>

        <div className="p-2">
          <PasswordForm />
        </div>

        <div className="p-2 md:col-span-2 lg:col-span-1">
          <NameForm />
        </div>

        <div className="p-2 md:col-span-2 lg:col-span-3">
          Data like subscription, articles, discussions(?)
          <br />
          <span className="font-bold">Articles:</span>
          <ul>
            {userData.articles.map((a) => (
              <li key={a.id}>{a.headline}</li>
            ))}
          </ul>
          <br />
          <br />
          <span className="font-bold">Comments:</span>
          <ul>
            {userData.comments.map((a) => (
              <li key={a.id}>
                {a.article.headline?.slice(0, 33)} - {a.content.slice(0, 33)}...
              </li>
            ))}
          </ul>
          <br />
        </div>
      </div>
    </Page>
  );
}
