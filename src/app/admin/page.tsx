import Page from "@/components/Page";
import { Separator } from "@/components/ui/separator";
import { getRole, getSessionData } from "@/lib/actions/sessiondata";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AdminPage() {
  const session = await getSessionData();

  if (
    !session ||
    (session.user.role !== "admin" && session.user.role !== "employee")
  ) {
    return notFound();
  }

  return (
    <Page>
      <div className="flex flex-col justify-center items-center my-10 gap-4">
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>
        <Separator />
        <Link href="/admin/article">Manage Articles</Link>
        <Link href="/admin/category">Manage Categories</Link>
        <Link href="/admin/user">Manage Users</Link>
        <Link href="/admin/newsletter">Newsletters</Link>
      </div>
    </Page>
  );
}
