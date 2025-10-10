"use client";

import { useEffect, useState } from "react";
import { aiArticleType, getAIArticle } from "./aiaction";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/components/Loader";

export default function AiArticle() {
  const [article, setArticle] = useState<aiArticleType>();
  const [gotArticle, setGotArticle] = useState<boolean>(false);

  useEffect(() => {
    const getTools = async () => {
      const theArticle = await getAIArticle();
      if (theArticle.article) setArticle(theArticle.article);

      setGotArticle(true);
    };

    if (!gotArticle) getTools();
  }, [gotArticle]);

  return (
    <div className="w-full p-2 border-2 rounded-xl">
      <div className="w-full text-2xl my-4">📰 AI News. </div>
      <div className="">
        {article ? (
          <Card className="max-w-full">
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
              <CardDescription>{article.date}</CardDescription>
            </CardHeader>
            <CardContent className="break-all">
              <Image
                width="300"
                height="300"
                src={article.img}
                alt="Article image"
              />
              <pre className="whitespace-pre-line break-words">
                {article.content}
              </pre>
            </CardContent>
            {/* <CardFooter>
              <p>Card Footer</p>
            </CardFooter> */}
          </Card>
        ) : (
          <Loader />
        )}
      </div>
      <div className="w-full p-2">
        Find more news at:
        <Link href="https://www.futuretools.io/news" className="underline">
          futuretools.io/news
        </Link>
      </div>
    </div>
  );
}
