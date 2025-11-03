"use client";

import { Button } from "@/components/ui/button";
import { UserWithRole } from "better-auth/plugins";

export default function UserListItem({
  user,
  onSelect,
}: {
  user: UserWithRole;
  onSelect?: (user: UserWithRole) => void;
}) {
  return (
    <div className="py-2 border-b flex items-center gap-4">
      <div>
        <p className="font-semibold">{user.name} </p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <div className="text-sm text-muted-foreground">
          Role: {user.role || "N/A"}
        </div>
      </div>

      <div className="ml-auto">
        <Button variant="outline" size="sm" onClick={() => onSelect?.(user)}>
          Select
        </Button>
      </div>
    </div>
  );
}
