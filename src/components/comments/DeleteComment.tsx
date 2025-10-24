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
import { deleteComment } from "@/lib/actions/comment";

export function DeleteCommentButton({
  commentId,
  userId,
}: {
  commentId: number;
  userId: string;
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
          <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
          <AlertDialogDescription>
            {`This comment will be permanently deleted. This action cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          action={async (formData) => {
            try {
              const id = Number(formData.get("id"));
              await deleteComment(id, userId);
              toast.success("Comment deleted");
              router.refresh();
            } catch (e) {
              console.error(e);
              toast.error("Failed to delete comment");
            }
          }}
        >
          <input type="hidden" name="id" value={commentId} />
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
