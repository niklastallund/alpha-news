"use client";

import { useState } from "react";
import UserListItem from "./UserListItem";
import { UserWithRole } from "better-auth/plugins";
import SelectedUserInfo from "./SelectedUserInfo";
import { useRouter } from "next/navigation";

export default function UsersPanel({ users }: { users: UserWithRole[] }) {
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const router = useRouter();

  function handleSelect(user: UserWithRole) {
    setSelectedUser(user);
  }

  function handleSuccess() {
    setSelectedUser(null);
    router.refresh();
  }

  return (
    <div className="flex gap-4 mt-2">
      <div className="w-1/3">
        {users.map((user) => (
          <UserListItem key={user.id} user={user} onSelect={handleSelect} />
        ))}
      </div>

      <div className="flex-1 p-4">
        <SelectedUserInfo user={selectedUser} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
