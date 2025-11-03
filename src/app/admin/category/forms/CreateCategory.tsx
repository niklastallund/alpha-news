"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  CreateCategoryInput,
  createCategorySchema,
} from "@/validations/category-forms";
import { createCategory } from "@/lib/actions/category";
import { normalizeCategoryName } from "@/app/ai/MultiselectBox";

export default function CreateCategoryForm() {
  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      onNavbar: false,
    },
  });

  async function onSubmit(data: CreateCategoryInput) {
    try {
      const name = data.name.trim();
      if (name) {
        const category = await createCategory({ ...data, name });

        if (!category) {
          toast.error("Failed to create category. Permission denied.");
          return;
        }
        toast.success("Category created!");
        form.reset();
      } else {
        toast.error("Name is empty.");
      }
    } catch (error) {
      toast.error(`Failed to create category: ${error}`);
      console.error(error);
    }
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Create Category</CardTitle>
        <CardDescription>Enter details to add a new category</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) =>
                        form.setValue(
                          field.name,
                          normalizeCategoryName(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="onNavbar"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-1 my-5">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked: boolean) =>
                        field.onChange(checked)
                      }
                    />
                  </FormControl>
                  <div className="space-y-0.5">
                    <FormLabel className="font-normal">
                      {`Display on navbar`}
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
