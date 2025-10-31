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
import { updateArticle } from "@/lib/actions/article";
import { Article } from "@/generated/prisma";
import {
  UpdateArticleInput,
  updateArticleSchema,
} from "@/validations/article-forms";
import { ForwardRefEditor } from "@/components/ForwardRefEditor";
import { Textarea } from "@/components/ui/textarea";
import ImageInput from "./ImageInput";
import { useState } from "react";
import {
  deleteFileFromR2,
  deleteImage,
  uploadBase64ToR2,
} from "@/lib/actions/ai";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UpdateArticleFormProps {
  article: Article;
}

export default function UpdateArticleForm({ article }: UpdateArticleFormProps) {
  const form = useForm<UpdateArticleInput>({
    resolver: zodResolver(updateArticleSchema),
    defaultValues: {
      id: article.id,
      headline: article.headline ?? "",
      summary: article.summary ?? "",
      content: article.content ?? "",
      image: article.image ?? "",
      editorsChoice: article.editorsChoice ?? false,
      onlyFor: article.onlyFor ?? undefined,
    },
  });

  async function onSubmit(data: UpdateArticleInput) {
    try {
      let image = data.image;

      if (data.image !== article.image) {
        image = ""; // If the user deleted it.

        // So image has changed!
        // We need to delete the old, and upload the new.

        if (article.image) {
          const deleted = await deleteFileFromR2(article.image);
          // alert("Deleted " + deleted);
        }

        // Upload the new image, and set variable image to that image.
        if (data.image) {
          const upload = await uploadBase64ToR2(data.image); // Returns the URL.

          if (upload.success) {
            image = upload.data;
            toast("Uploaded picture.");
          } else {
            toast.error("Could not upload picture.\n" + upload.msg);

            return;
          }
        }
      }

      // Ersätt image med den uppladdade urlen:
      const datWithImg = { ...data, image: image };

      await updateArticle(datWithImg);
      // alert(JSON.stringify(datWithImg));
      toast.success("Article updated");
    } catch (error) {
      toast.error("Failed to update article");
      console.error(error);
    }
  }

  const watchedArticleData = form.watch(["headline", "content", "summary"]);
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Article ID: {article.id}</CardTitle>
        <CardDescription>Edit the article details here</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
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
                      rows={4}
                      className="min-h-28 resize-y"
                      placeholder="Write a summary..."
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
                    <ImageInput
                      showGenerate={true}
                      articleData={{
                        headline: watchedArticleData[0] ?? "",
                        category: "", // So here we dont use category. maybe fix later, but it will still work.
                        content: watchedArticleData[1] ?? "",
                        summary: watchedArticleData[2] ?? "", // ok so e or a... fix
                      }}
                      showUploader={true}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="editorsChoice"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(Boolean(checked))
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

            <FormField
              control={form.control}
              name="onlyFor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Level</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? undefined : value)
                    }
                    defaultValue={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select subscription level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Subscription</SelectLabel>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Updating..." : "Update"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
