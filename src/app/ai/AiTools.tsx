"use client";

import { useEffect, useState } from "react";
import { AiToolsType, getNewestTools } from "./aiaction";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AiTools() {
  const [tools, setTools] = useState<AiToolsType[]>([]);
  const [gotTools, setGotTools] = useState<boolean>(false);
  useEffect(() => {
    const getTools = async () => {
      const tools = await getNewestTools();
      setTools(tools.tools ?? []);
      setGotTools(true);
    };

    if (!gotTools) getTools();
  }, [gotTools]);

  return (
    <div className="w-full p-2 border-2 rounded-xl">
      <div className="w-full text-2xl my-4">🔧 Newest AI Tools </div>
      <div className="md:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, i) => (
          <Card key={i} className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>{tool.title}</CardTitle>
              <CardDescription>
                <div className="relative w-full aspect-video">
                  <Image
                    src={tool.img}
                    fill
                    className="object-cover rounded-md"
                    alt={"Image for ai tool " + tool.title}
                  />
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{tool.description}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full p-2 cursor-pointer" asChild>
                <Link href={tool.url}>Visit</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="w-full p-2">
        Find more at:{" "}
        <Link href="https://www.futuretools.io" className="underline">
          futuretools.io
        </Link>
      </div>
    </div>
  );
}
