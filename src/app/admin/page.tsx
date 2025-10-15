import Page from "@/components/Page";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function AdminPage() {
  return (
    <Page>
      <div className="flex flex-col justify-center items-center my-10 gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Separator />
        <Link href="/admin/article">Manage Articles</Link>
        <Link href="/admin/category">Manage Categories</Link>
        <Link href="/admin/user">Manage Users</Link>
      </div>
    </Page>
  );
}
