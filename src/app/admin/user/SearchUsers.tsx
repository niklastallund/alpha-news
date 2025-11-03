import SearchBar from "@/components/filtering/SearchBar";
import PaginationBar from "@/components/PaginationBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { UserWithRole } from "better-auth/plugins";
import { headers } from "next/headers";
import UsersPanel from "./UsersPanel";

// Build page hrefs that keep the search query param used by SearchBar ('q')
// and add/update the page param for pagination links
function createPageHref(page: number, query?: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", String(query));
  // only include page when it's greater than 1 to keep URLs clean
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `?${qs}` : "/admin/user";
}

// Set the pagination size
const PAGE_SIZE = 10;

export default async function SearchUsers({
  query,
  page,
}: {
  query?: string;
  page?: number | string;
}) {
  const currentPage = Math.max(1, Number(page || 1));

  const response = await auth.api.listUsers({
    headers: await headers(),
    query: {
      searchValue: query || "",
      searchField: "name",
      searchOperator: "contains",
      limit: PAGE_SIZE,
      offset: (currentPage - 1) * PAGE_SIZE,
    },
  });

  // Extract users and pagination info
  const users: UserWithRole[] = response.users;
  const totalUsers: number = response.total;
  const totalPages = Math.max(1, Math.ceil(totalUsers / PAGE_SIZE));

  return (
    <Card className="min-w-1/3">
      <CardHeader>
        <CardTitle>User Search</CardTitle>
        <CardDescription>
          Search for users by name (case sensitive)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-1/3">
          <SearchBar placeholder="Search for users..." />
        </div>
        <UsersPanel users={users} />
        <div className="w-1/3">
          <PaginationBar
            totalPages={totalPages}
            currentPage={currentPage}
            createHref={createPageHref}
            className="mt-4"
          />
        </div>
      </CardContent>
    </Card>
  );
}
