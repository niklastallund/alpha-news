"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ForwardRefEditor } from "../ForwardRefEditor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  editCommentSchema,
  type EditCommentInput,
} from "@/validations/comment-forms";
import { editComment } from "@/lib/actions/comment";
import { toast } from "sonner";

interface EditCommentFormProps {
  initialContent: string;
  commentId: number;
  userId: string;
  onCancel: () => void;
  onOptimisticUpdate?: (newContent: string) => void;
  // pass both the previous (committed) content and the user's draft so the parent
  // can restore the draft into the editor after a failure.
  onError?: (prevContent: string, draftContent: string) => void;
}

export default function EditCommentForm({
  initialContent,
  commentId,
  userId,
  onCancel,
  onOptimisticUpdate,
  onError,
}: EditCommentFormProps) {
  const form = useForm<EditCommentInput>({
    resolver: zodResolver(editCommentSchema),
    defaultValues: {
      content: initialContent,
      commentId: commentId,
      userId: userId,
    },
  });

  const router = useRouter();

  async function submit(values: EditCommentInput) {
    const prev = initialContent;
    // update UI optimistically for more responsive feel
    onOptimisticUpdate?.(values.content);

    try {
      await editComment(values);
      toast.success("Comment updated");
      // refresh server data so the optimistic UI is reconciled with the DB
      router.refresh();
    } catch {
      // revert optimistic update but keep the user's draft in the editor
      onError?.(prev, values.content);
      toast.error("Failed to update comment");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-3">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ForwardRefEditor markdown={field.value || ""} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => {
              form.reset({ content: initialContent });
              onCancel();
            }}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
