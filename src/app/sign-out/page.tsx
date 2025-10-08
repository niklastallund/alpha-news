import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { redirect } from "next/navigation";


export default async function SignOut() {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");


  try {    
    const signOut = await auth.api.signOut({
      headers: await headers(),
    });
    console.log(JSON.stringify(signOut));

  } catch(e) {
    console.log("Logout error: " + JSON.stringify(e));
  }
  
  redirect("/");
  
}


