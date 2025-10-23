"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ForwardRefEditor } from "../ForwardRefEditor";
import { Button } from "../ui/button";

export default function AddCommentForm() {
  const form = useForm({
    defaultValues: {
      comment: "",
    },
  });

  function onSubmit() {
    //TODO
    return;
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ForwardRefEditor markdown={field.value || ""} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant="outline"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Adding comment..." : "Comment"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
