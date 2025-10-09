import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { redirect } from "next/navigation";

/**
 * Just signing out the user, redirecting to start page.
 */
export default async function SignOut() {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If not signed-in, redirect to sign-in.
  if (!session) redirect("/sign-in");

  try {    

    // Use the better-auth api to sign the user out. (This is a server action so we need to use the API-variant)
    const signOut = await auth.api.signOut({
      headers: await headers(),
    });

    if (!signOut.success) console.log("Signout failed.");

  } catch(e) {
    console.log("Logout error: " + JSON.stringify(e));
  }
  
  redirect("/");
  
}


