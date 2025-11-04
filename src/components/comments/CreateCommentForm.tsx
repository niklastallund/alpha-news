"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ForwardRefEditor } from "../ForwardRefEditor";
import { Button } from "../ui/button";
import { CreateCommentInput } from "@/validations/comment-forms";
import { createComment } from "@/lib/actions/comment";
import { useRouter } from "next/navigation";

interface CreateCommentFormProps {
  articleId: number;
  userId: string;
  isBanned: boolean;
  banReason?: string | null;
}

// This component renders a form to add a new comment to an article.
export default function CreateCommentForm({
  articleId,
  userId,
  isBanned,
  banReason,
}: CreateCommentFormProps) {
  const form = useForm<CreateCommentInput>({
    defaultValues: {
      content: "",
      articleId: articleId,
      userId: userId,
    },
  });

  const router = useRouter();

  async function onSubmit(values: CreateCommentInput) {
    try {
      await createComment(values);
      form.reset();
      router.refresh();
    } catch (err) {
      console.error("Failed to create comment", err);
    }
  }

  if (isBanned) {
    return (
      <div
        className="p-4 mb-4 text-lg text-red-700 bg-red-100 rounded-lg border border-red-200"
        role="alert"
      >
        <strong className="font-bold">You are banned from commenting.</strong>
        <span className="block">
          {" "}
          Reason: {`"${banReason || "No reason provided."}"`}
        </span>
      </div>
    );
  } else {
    return (
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ForwardRefEditor
                      markdown={field.value || ""}
                      {...field}
                      placeholder="Write a comment..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Adding comment..." : "Comment"}
            </Button>
          </form>
        </Form>
      </div>
    );
  }
}
