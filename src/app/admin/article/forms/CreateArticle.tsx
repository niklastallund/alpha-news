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
import {
  CreateArticleInput,
  createArticleSchema,
} from "@/validations/article-forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createArticle } from "@/lib/actions/article";
import { ForwardRefEditor } from "@/components/ForwardRefEditor";
import { Textarea } from "@/components/ui/textarea";

export default function CreateArticleForm() {
  const form = useForm<CreateArticleInput>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      headline: "",
      summary: "",
      content: "",
      image: "",
      editorsChoice: false,
    },
  });

  async function onSubmit(data: CreateArticleInput) {
    try {
      await createArticle(data);
      toast.success("Article created");
      form.reset();
    } catch (error) {
      toast.error("Failed to create article");
      console.error(error);
    }
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Create Article</CardTitle>
        <CardDescription>Enter details to add a new article</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headline</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      className="min-h-28 resize-y"
                      placeholder="Write a headline..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={6}
                      className="min-h-28 resize-y"
                      placeholder="Write a short summary..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <ForwardRefEditor markdown={field.value || ""} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image link</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="editorsChoice"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-1">
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
                      {`Editor's Choice`}
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit">Create</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
