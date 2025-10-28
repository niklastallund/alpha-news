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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function UserPage() {
  const session = await getSessionData();

  if (!session) redirect("/");

  const sub = await prisma.subscription.findFirst({
    where: {
      referenceId: session.user.id,
    },
  });

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
          <br />

          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              Active: {JSON.stringify(sub)}.
              <br />
              Upgrade:
              <br />
              <div className="grid grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic</CardTitle>
                    <CardDescription></CardDescription>
                  </CardHeader>
                  <CardContent>
                    69:- / Month
                    <Button>Upgrade</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>PRO</CardTitle>
                    <CardDescription></CardDescription>
                  </CardHeader>
                  <CardContent>
                    99:- / Month
                    <Button>Upgrade</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your articles:</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul>
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

          <Card>
            <CardHeader>
              <CardTitle>Your comments:</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul>
                {userData.comments.map((a) => (
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
