import Page from "@/components/Page";
import Link from "next/link";

export default function AdminPage() {
  return (
    <Page>
      <div className="flex flex-col justify-center items-center my-10 gap-4">
        <Link href="/admin/article">Manage Articles</Link>
      </div>
    </Page>
  );
}
