"use client"

// So this is signing out the user and showing that.

import { authClient } from "@/lib/auth-client";
import { useSession } from "@/lib/SessionProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function SignOut() {

  const { user, session } = useSession();
  const router = useRouter();

  useEffect( () => {
    const logout = async () => {
        await authClient.signOut();
        //console.log(signedout);
        window.location.reload();
        
    }

    if (session) logout();
    if (!session) router.push("/")
  }, [session, router])



  return (
    <div className="text-center">
      signing out {user?.email}...
      <br/>
              <div className="w-full flex justify-center p-5 mx-auto"><div className="w-20 h-20 rounded-full animate-spin border-8 border-blue-600 border-t-blue-200 text-2xl flex text-center items-center"><div className="w-10 h-10 border-6 border-red-600 border-b-red-200 rounded-full mx-auto my-auto"></div></div></div>

              </div>
  )
}
