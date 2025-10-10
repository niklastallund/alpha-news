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

export default async function UserPage() {
  const session = await getSessionData();

  if (!session) redirect("/");

  return (
    <Page>
      <div className="w-full md:grid sm:grid-cols-2 md:grid-cols-3 gap-2">
        <div className="p-2 md:col-span-3 md:flex md:flex-wrap md:gap-2 md:items-end">
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

        <div className="p-2">
          <NameForm />
        </div>

        <div className="p-2 md:col-span-3">
          Data like subscription, articles, discussions(?)
        </div>
      </div>
    </Page>
  );
}
