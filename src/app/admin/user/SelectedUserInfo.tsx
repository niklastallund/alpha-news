"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserWithRole } from "better-auth/plugins";
import { BanUserInput } from "./BanUser";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import SetUserRole from "./SetUserRole";
import { UserRole } from "./SetUserRole";
import { useSession } from "@/lib/SessionProvider";

export default function SelectedUserInfo({
  user,
  onSuccess,
}: {
  user: UserWithRole | null;
  onSuccess?: () => void;
}) {
  const session = useSession();
  const employeeId = session.user?.id;
  const isAdmin = session.user?.role === "admin";

  async function handleUnban() {
    try {
      const { data } = await authClient.admin.hasPermission({
        userId: employeeId,
        permission: {
          user: ["ban"],
        },
      });

      if (!data?.success !== true) {
        toast.error("You do not have permission to ban users.");
        return;
      }
      await authClient.admin.unbanUser({ userId: user!.id });
      toast.success("User unbanned successfully");
      onSuccess?.();
    } catch (error) {
      toast.error(`Failed to unban user: ${error}`);
    }
  }

  return (
    <>
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>
              <p className="text-lg font-semibold">{user?.name}</p>
            </CardTitle>
            <CardDescription>
              <p className="text-sm">{`ID: ${user?.id}`}</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between gap-2 mb-2">
              <div className="flex flex-col gap-1">
                <p className="text-sm">{`Email: ${user?.email}`}</p>
                <p className="text-sm">{`Role: ${user?.role || "N/A"}`}</p>
                <p className="text-sm">
                  Banned:{" "}
                  <span
                    className={user?.banned ? "text-red-600 font-bold" : ""}
                  >
                    {user?.banned ? "YES" : "No"}
                  </span>
                </p>
                {user?.banned && (
                  <p className="text-sm">{`Ban Reason: ${
                    user?.banReason || "N/A"
                  }`}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {isAdmin && (
                  <SetUserRole
                    userId={user.id}
                    userRole={(user.role as UserRole) || "user"}
                    onSuccess={onSuccess}
                  />
                )}
                {user?.banned ? (
                  <Button variant="destructive" onClick={handleUnban}>
                    Unban
                  </Button>
                ) : (
                  <BanUserInput userId={user.id} onSuccess={onSuccess} />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
