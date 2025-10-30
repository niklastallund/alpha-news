import SearchBar from "@/components/filtering/SearchBar";
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

// Set the pagination size
const PAGE_SIZE = 10;

export default async function SearchUsers({ query }: { query?: string }) {
  const currentPage = 2;

  const response = await auth.api.listUsers({
    headers: await headers(),
    query: {
      limit: 10,
      offset: 0,
    },
  });

  const users: UserWithRole[] = response.users;

  console.log("User list:", users);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Search</CardTitle>
        <CardDescription>Search for users by name</CardDescription>
      </CardHeader>
      <CardContent>
        <SearchBar placeholder="Search for users..." />
        {users.map((user) => (
          <div key={user.id} className="py-2 border-b last:border-0">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
