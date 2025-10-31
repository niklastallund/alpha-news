//TODO
// Implement user detail component
// Implement user role management
// Implement user ban functionality
// Implement pagination for user list
// Implement user creation component
// Implement user activity log component

import { notFound } from "next/navigation";
import SearchUsers from "./SearchUsers";
import { getSessionData } from "@/lib/actions/sessiondata";
import Page from "@/components/Page";

export default async function AdminUserPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: number }>;
}) {
  const session = await getSessionData();

  if (!session || session.user.role !== "admin") {
    return notFound();
  }

  // Get the search params to filter users
  const params = await searchParams;
  const query = params.q || "";
  const page = params.page ? Number(params.page) : 1;

  return (
    <Page>
      <div className=" w-full">
        <SearchUsers query={query} page={page} />
      </div>
    </Page>
  );
}
