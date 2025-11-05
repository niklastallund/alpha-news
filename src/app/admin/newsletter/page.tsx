import Page from "@/components/Page";
import React from "react";
import CreateNewsletter from "./CreateNewsletter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreatePersonalNewsletter from "./CreatePersonalNL";
import { getNLMails } from "@/lib/actions/newsletter";

export default async function page() {
  const mails = await getNLMails();

  return (
    <Page>
      <div>
        <span className="font-bold text-2xl">Newsletters</span>
        <br />
        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">general</TabsTrigger>
            <TabsTrigger value="personal">personal</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <CreateNewsletter />
          </TabsContent>
          <TabsContent value="personal">
            <CreatePersonalNewsletter mails={mails} />
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  );
}
