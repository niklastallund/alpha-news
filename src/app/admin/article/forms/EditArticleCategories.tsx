"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateArticleCategories } from "@/lib/actions/article";
import { Category } from "@/generated/prisma";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FormSchema = z.object({
  categoryIds: z.array(z.number()).min(1, "Select at least one category."),
});

export function EditArticleCategories({
  articleId,
  allCategories,
  currentCategoryIds,
  setUpd,
}: {
  articleId: number;
  allCategories: Category[];
  currentCategoryIds: number[];
  setUpd: Dispatch<SetStateAction<boolean>>;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categoryIds: currentCategoryIds ?? [],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("articleId", String(articleId));
        for (const id of data.categoryIds) {
          fd.append("categoryIds", String(id));
        }
        await updateArticleCategories(fd);
        toast.success("Categories updated!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to update categories.");
      }
    });
    setUpd(true);
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardDescription>
          Select the categories for this article
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="categoryIds"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-2 gap-2">
                    {allCategories.map((category) => (
                      <FormItem
                        key={category.id}
                        className="flex flex-row items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(category.id)}
                            disabled={isPending}
                            onCheckedChange={(checked) => {
                              const isChecked = Boolean(checked);
                              const current = field.value ?? [];
                              const next = isChecked
                                ? [...current, category.id]
                                : current.filter((id) => id !== category.id);
                              field.onChange(next);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {category.name}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save categories"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
