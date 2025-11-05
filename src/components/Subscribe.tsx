"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { useSession } from "@/lib/SessionProvider";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Subscribe() {
  const session = useSession();
  const [uSub, setuSub] = useState<{
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
  } | null>();

  useEffect(() => {
    const fetchSubs = async () => {
      if (session.user?.id) {
        const res = await authClient.subscription.list();

        const userSub = res.data?.filter(
          (s) => s.referenceId === session.user?.id
        )[0];

        setuSub(userSub);
      }
    };
    fetchSubs();
  }, [session.user?.id]);

  if (!session.user) return "No user.";

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {uSub ? (
            <div>
              Your subscription:
              <br />
              {uSub?.plan} ({uSub?.status})<br />
              Started: {uSub?.periodStart?.toLocaleDateString()}
              <br />
              ends: {uSub?.periodEnd?.toLocaleDateString()}
              {uSub.cancelAtPeriodEnd && (
                <div className="font-bold">Cancelled!</div>
              )}
              <br />
              {uSub.cancelAtPeriodEnd && !uSub.cancelAtPeriodEnd && (
                <Button
                  variant={"secondary"}
                  onClick={async () =>
                    await authClient.subscription.cancel({
                      returnUrl: "/user/",
                    })
                  }
                >
                  Cancel
                </Button>
              )}
            </div>
          ) : (
            <div>No subscription.</div>
          )}
          <br />
          <div className="sm:grid sm:grid-cols-2 sm:gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="italic text-lg pb-10">69:- / Mo</div>
                {uSub && uSub.plan === "pro" && (
                  <Button
                    variant={"default"}
                    className="w-2/3 md:w-1/2"
                    onClick={async () => {
                      await authClient.subscription.upgrade({
                        plan: "basic",
                        successUrl: "/user/",
                        cancelUrl: "/user/",
                        subscriptionId: uSub.id,
                      });
                    }}
                  >
                    Downgrade
                  </Button>
                )}
                {!uSub && (
                  <Button
                    variant={"default"}
                    className="w-2/3 md:w-1/2"
                    onClick={async () => {
                      await authClient.subscription.upgrade({
                        plan: "basic",
                        successUrl: "/user/",
                        cancelUrl: "/user/",
                      });
                    }}
                  >
                    Subscribe
                  </Button>
                )}
                <br />
                <br />
                Get access to most of our articles!
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PRO</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="italic text-lg pb-10">99:- / Mo</div>
                {uSub && uSub.plan === "basic" && (
                  <Button
                    variant={"default"}
                    className="w-2/3 md:w-1/2"
                    onClick={async () => {
                      await authClient.subscription.upgrade({
                        plan: "pro",
                        successUrl: "/user/",
                        cancelUrl: "/user/",
                        subscriptionId: uSub.id,
                      });
                    }}
                  >
                    Upgrade
                  </Button>
                )}
                {!uSub && (
                  <Button
                    variant={"default"}
                    className="w-2/3 md:w-1/2"
                    onClick={async () => {
                      await authClient.subscription.upgrade({
                        plan: "pro",
                        successUrl: "/user",
                        cancelUrl: "/user",
                      });
                    }}
                  >
                    Subscribe
                  </Button>
                )}
                <br />
                <br />
                Get full access to all of our articles!
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
