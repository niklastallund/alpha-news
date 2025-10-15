import Page from "@/components/Page";
import { prisma } from "@/lib/prisma";
import CreateCategoryForm from "./forms/CreateCategory";
import UpdateCategoryDialog from "./forms/UpdateCategoryDialog";
import { DeleteCategoryButton } from "./forms/DeleteCategory";

export default async function AdminCategoryPage() {
  const categories = await prisma.category.findMany({
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  return (
    <Page>
      <div className="my-10 flex w-full justify-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left: Create form */}
            <div className="w-full lg:w-1/2">
              <CreateCategoryForm />
            </div>
            {/* Right: Category list */}
            <div className="w-full lg:w-1/2">
              {categories.length > 0 ? (
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li
                      key={category.id}
                      className="flex items-start justify-between rounded-xl border bg-card p-4 shadow-sm"
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <h3 className="font-medium truncate">
                          {category.name || "Untitled"}
                        </h3>
                        <p className="text-sm text-muted-foreground italic truncate">
                          {`Navbar: ${category.onNavbar ? "Yes" : "No"}`}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <UpdateCategoryDialog category={category} />
                        <DeleteCategoryButton
                          categoryId={category.id}
                          categoryName={category.name}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No category found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
