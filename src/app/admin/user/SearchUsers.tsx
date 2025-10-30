import SearchBar from "@/components/filtering/SearchBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis, // added
} from "@/components/ui/pagination";
import { auth } from "@/lib/auth";
import { getPaginationItems } from "@/lib/pagination";
import { UserWithRole } from "better-auth/plugins";
import { headers } from "next/headers";

// Build page hrefs that keep the search query param used by SearchBar ('q')
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

  // Windowed pagination with 2 siblings on each side
  const paginationItems = getPaginationItems(totalPages, currentPage, 2);

  return (
    <Card className="min-w-1/3">
      <CardHeader>
        <CardTitle>User Search</CardTitle>
        <CardDescription>
          Search for users by name (case sensitive)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SearchBar placeholder="Search for users..." />
        {users.map((user) => (
          <div key={user.id} className="py-2 border-b last:border-0">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        ))}
        {totalPages > 0 && (
          <Pagination className="mt-8 flex justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={createPageHref(Math.max(1, currentPage - 1), query)}
                  aria-disabled={currentPage === 1}
                  tabIndex={currentPage === 1 ? -1 : 0}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                />
              </PaginationItem>

              {paginationItems.map((item, idx) =>
                item === "ellipsis" ? (
                  <PaginationItem key={`e-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href={createPageHref(item, query)}
                      isActive={currentPage === item}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href={createPageHref(
                    Math.min(totalPages, currentPage + 1),
                    query
                  )}
                  aria-disabled={currentPage === totalPages}
                  tabIndex={currentPage === totalPages ? -1 : 0}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
}
