import Page from "@/components/Page";
import React from "react";
import CreateNewsletter from "./CreateNewsletter";
import { getRole } from "@/lib/actions/sessiondata";

export default async function page() {
  return (
    <Page>
      <div>
        <span className="font-bold text-2xl">Newsletter</span>
        <br />
        <CreateNewsletter />
      </div>
    </Page>
  );
}
