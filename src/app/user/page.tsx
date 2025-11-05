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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Subscribe from "../../components/Subscribe";

export default async function UserPage() {
  const session = await getSessionData();

  if (!session) redirect("/");

  // const sub = await prisma.subscription.findFirst({
  //   where: {
  //     referenceId: session.user.id,
  //   },
  // });

  const articles = await prisma.article.findMany({
    where: { author: { some: { id: session.user.id } } },
  });

  const comments = await prisma.comment.findMany({
    where: { authorId: session.user.id },
    include: { article: true },
  });

  const newsLetter = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { newsLetter: true },
  });

  const userData = { articles, comments, newsLetter };

  return (
    <Page>
      <div className="w-full md:grid md:grid-cols-2 lg:grid-cols-3 gap-2">
        <div className="p-2 md:col-span-2 lg:col-span-3 md:flex md:flex-wrap md:gap-2 md:items-end">
          {/* <UserPic></UserPic> */}

          <div>
            <span className="text-4xl">{session.user.name}</span>
            <br />
            <span className="text-xl font-bold">
              {session.user.email} ({session.user.role})
            </span>
            <br />
          </div>
        </div>

        <div className="p-2">
          <ImageUploader />
        </div>

        <div className="p-2"><PasswordForm /></div>

        <div className="p-2 md:col-span-2 lg:col-span-1">
          <NameForm newsLetter={userData.newsLetter?.newsLetter ?? false} />
        </div>

        <div className="p-2 md:col-span-2 lg:col-span-3">
          <Subscribe />

          <br />

          <Card>
            <CardHeader>
              <CardTitle>Your articles:</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2 font-bold underline">
                {userData.articles.map((a) => (
                  <li key={a.id}>
                    <Link href={"/article/" + a.id}>{a.headline}</Link>
                  </li>
                ))}
              </ul>
              <br />
            </CardContent>
          </Card>

          <br />

          <br />

          <Card>
            <CardHeader>
              <CardTitle>Your latest comments:</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2 font-bold underline">
                {userData.comments.slice(0, 30).map((a) => (
                  <li key={a.id}>
                    <Link href={"/article/" + a.article.id}>
                      <span className="font-bold">
                        {a.article?.headline
                          ? a.article.headline.slice(0, 15)
                          : ""}
                        {a.article?.headline &&
                          a.article.headline.length > 15 &&
                          "..."}{" "}
                        -{" "}
                      </span>
                      {a.content.slice(0, 33)} {a.content.length > 33 && "..."}
                    </Link>
                  </li>
                ))}
              </ul>
              <br />
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  );
}
