//TODO
// Implement user search component useDebounce
// Implement user detail component
// Implement user role management
// Implement user ban functionality
// Implement pagination for user list
// Implement user creation component
// Implement user activity log component

import { notFound } from "next/navigation";
import SearchUsers from "./SearchUsers";
import { getSessionData } from "@/lib/actions/sessiondata";

export default async function AdminUserPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await getSessionData();

  if (!session || session.user.role !== "admin") {
    return notFound();
  }

  // Get the search params to filter users
  const params = await searchParams;
  const query = params.q || "";

  return (
    <div className="flex justify-center">
      <SearchUsers query={query} />
    </div>
  );
}
