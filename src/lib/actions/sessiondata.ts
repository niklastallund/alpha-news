"use server";
// So in this folder we have serveractions

import { headers } from "next/headers";
import { auth } from "../auth";

/**
 *
 * @returns The signed in users role! (or undefined if no session).
 */
export async function getRole(): Promise<string | undefined> {
  // Get the sessionData and provide it to the sessionprov.
  const sessionData = await getSessionData();

  return sessionData?.user.role;
}

// So this is the type of what better-auth getSession returns (awaited):
type SessionData = Awaited<ReturnType<typeof auth.api.getSession>>;

/**
 *  Just a faster way than always including headers etc. Use in server components!
 * @returns The sessionData from better-auth.
 */
export async function getSessionData(): Promise<SessionData | null> {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  return sessionData;
}

export async function getSub(): Promise<{
  limits: Record<string, number> | undefined;
  priceId: string | undefined;
  id: string;
  plan: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  trialStart?: Date;
  trialEnd?: Date;
  referenceId: string;
  status:
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "paused"
    | "trialing"
    | "unpaid";
  periodStart?: Date;
  periodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  groupId?: string;
  seats?: number;
} | null> {
  const session = await getSessionData();

  if (session?.user.id) {
    const res = await auth.api.listActiveSubscriptions({
      query: { referenceId: session.user.id },
      headers: await headers(),
    });

    //console.log("Got via server-action sub:\n" + JSON.stringify(res[0]));
    const ok = res.find(
      (sub) => sub.status === "active" || sub.status === "trialing"
    );
    return ok ?? null;
  }

  return null;
}
