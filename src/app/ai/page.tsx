import Page from "@/components/Page";

import React from "react";
import AiTools from "./AiTools";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AiArticle from "./AiArticle";

export default function page() {
  return (
    <Page>
      <div className="p-2 w-full">
        <div className="text-4xl">🤖 AI NEWS</div>

        <div className="mt-5">
          <Tabs defaultValue="tools" className="w-full">
            <TabsList>
              <TabsTrigger value="article">Article</TabsTrigger>
              <TabsTrigger value="tools">Newest AI Tools</TabsTrigger>
            </TabsList>
            <TabsContent value="article">
              <AiArticle />
            </TabsContent>
            <TabsContent value="tools">
              <AiTools />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Page>
  );
}
