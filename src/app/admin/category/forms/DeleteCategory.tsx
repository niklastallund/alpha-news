"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteCategory } from "@/lib/actions/category";

// This does not use react-hook-form because it's a simple confirmation dialog
export function DeleteCategoryButton({
  categoryId,
  categoryName,
}: {
  categoryId: number;
  categoryName?: string | null;
}) {
  const router = useRouter();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this category?</AlertDialogTitle>
          <AlertDialogDescription>
            {`Category named "${
              categoryName || "Untitled"
            }" will be permanently deleted. This action cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          action={async (formData) => {
            try {
              const id = Number(formData.get("id"));
              await deleteCategory(id);
              toast.success("Category deleted");
              router.refresh();
            } catch (e) {
              console.error(e);
              toast.error("Failed to delete category. Permission Denied.");
            }
          }}
        >
          <input type="hidden" name="id" value={categoryId} />
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
