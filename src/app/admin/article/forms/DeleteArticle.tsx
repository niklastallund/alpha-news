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
import { deleteArticle } from "@/lib/actions/article";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

// This does not use react-hook-form because it's a simple confirmation dialog
export function DeleteArticleButton({
  articleId,
  articleHeadline,
  setUpd,
}: {
  articleId: number;
  articleHeadline?: string | null;
  setUpd: Dispatch<SetStateAction<boolean>>;
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
          <AlertDialogTitle>Delete this article?</AlertDialogTitle>
          <AlertDialogDescription>
            {`"${articleHeadline || "Untitled"}"`} will be permanently deleted.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          action={async (formData) => {
            try {
              const id = Number(formData.get("id"));
              await deleteArticle(id);
              toast.success("Article deleted");
              setUpd(true);
              router.refresh();
            } catch (e) {
              console.error(e);
              toast.error("Failed to delete article");
            }
          }}
        >
          <input type="hidden" name="id" value={articleId} />
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
