import Page from "@/components/Page";
import React from "react";
import CreateNewsletter from "./CreateNewsletter";
import { getRole } from "@/lib/actions/sessiondata";

export default async function page() {
  const role = await getRole();
  if (role !== "admin")
    return (
      <Page>
        <div>You need to be admin.</div>
      </Page>
    );

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
