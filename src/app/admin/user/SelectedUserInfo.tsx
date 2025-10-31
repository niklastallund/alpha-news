"use client";

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
        <p className="text-sm">{`Email: ${user?.email}`}</p>
        <p className="text-sm">{`Role: ${user?.role || "N/A"}`}</p>
      </CardContent>
    </Card>
  );
}
