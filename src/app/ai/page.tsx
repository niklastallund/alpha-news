import Page from "@/components/Page";

import React from "react";
import AiTools from "./AiTools";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function page() {
  return (
    <Page>
      <div className="p-2 w-full text-center">
        <div className="text-4xl">🤖 AI NEWS</div>

        <div className="mt-5">
          <Tabs defaultValue="article" className="w-full">
            <TabsList>
              <TabsTrigger value="article">Article</TabsTrigger>
              <TabsTrigger value="tools">Newest AI Tools</TabsTrigger>
            </TabsList>
            <TabsContent value="article">
              <p>Article under construction...</p>
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
