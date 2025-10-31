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

export default function SelectedUserInfo({
  user,
}: {
  user: UserWithRole | null;
}) {
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
                <Button variant="outline">Set Role</Button>
                {user?.banned ? (
                  <Button variant="outline">Unban</Button>
                ) : (
                  <Button variant="destructive">Ban</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
