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
import {
  CreateArticleInput,
  createArticleSchema,
} from "@/validations/article-forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateArticleForm() {
  const form = useForm<CreateArticleInput>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      content: "",
      headline: "",
      summary: "",
      image: "",
    },
  });

  async function onSubmit(data: CreateArticleInput) {
    try {
      await createPerson(data);
      toast.success("Person created");
      form.reset();
    } catch (error) {
      toast.error("Failed to create person");
      console.error(error);
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Create Person</CardTitle>
        <CardDescription>Enter details to add a new person </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="tmdbId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TMDB ID (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value?.toString() ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birthday</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      onChange={(e) => {
                        const val = e.target.valueAsDate;
                        if (val) {
                          field.onChange(val);
                        } else {
                          field.onChange(undefined);
                        }
                      }}
                      value={field.value?.toISOString().split("T")[0] ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deathday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deathday (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      onChange={(e) => {
                        const val = e.target.valueAsDate;
                        if (val) {
                          field.onChange(val);
                        } else {
                          field.onChange(undefined);
                        }
                      }}
                      value={field.value?.toISOString().split("T")[0] ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="biography"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biography</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profilePath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile path ( /xxxxxxxxxx... )</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
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
