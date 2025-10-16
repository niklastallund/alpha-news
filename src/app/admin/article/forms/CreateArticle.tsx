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
import { useEffect, useRef, useState } from "react";
import { GeneratedArticle } from "@/app/ai/ai";
import Genai from "@/app/ai/Genai";
import { MDXEditorMethods } from "@mdxeditor/editor";

// Helper to parse CSV from form into a list of unique, trimmed category names.
// Will remove duplicates (case-insensitive) and ignore empty entries.
// You can check this by trying to for example add "News, news,  , Sports,,sports"
// -> will result in ["News", "Sports"]
function parseCategories(csv: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  csv
    .split(/[,\n]/g) // allow commas or newlines
    .map((s) => s.trim().replace(/\s+/g, " ")) // trim and collapse internal spaces
    .filter(Boolean)
    .forEach((val) => {
      const key = val.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(val);
      }
    });

  return out;
}

export default function CreateArticleForm() {
  const [categoriesCsv, setCategoriesCsv] = useState<string>(""); // categories as CSV string

  const form = useForm<CreateArticleInput>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      headline: "",
      summary: "",
      content: "",
      image: "",
      editorsChoice: false,
      categories: [],
    },
  });

  //#region From tobbe.
  // This is for generating ai, so i added this.
  const [importedArticle, setImportedArticle] = useState<GeneratedArticle>(); // Will hold the generated article after import.
  const [importGen, setImportGen] = useState<boolean>(false); // This is for show/hide the import component.

  const close = () => {
    setImportGen(false);
  };

  const ref = useRef<MDXEditorMethods>(null);
  const [editorKey, setEditorKey] = useState<string>(Math.random().toString()); // Lägg till ett state för nyckeln

  // Så vi kör en useEffect här, och uppdaterar innehållet i formuläret om article blir satt.

  useEffect(() => {
    if (importedArticle) {
      // Trim whitespace from category string and parse, probably unecessary but just to be sure.
      importedArticle.category = `${importedArticle.category}`.trim();
      const parsedCategories = parseCategories(importedArticle.category);

      // Update the CSV state to reflect parsed categories
      setCategoriesCsv(parsedCategories.join(", "));

      form.reset({
        headline: importedArticle.headline,
        summary: importedArticle.summery,
        content: importedArticle.content,
        image: importedArticle.imageUrl || form.getValues("image"),
        categories: parsedCategories,
        editorsChoice: form.getValues("editorsChoice"),
      });

      // If your editor needs explicit set after reset, keep only one of these:
      ref.current?.setMarkdown(importedArticle.content);
      setEditorKey(Math.random().toString());
    }
  }, [form, importedArticle]);

  //#endregion tobbe

  async function onSubmit(data: CreateArticleInput) {
    try {
      // Re-parse just before submit, in case user made changes and didn't blur the input
      const parsedCategories = parseCategories(categoriesCsv);

      // parsedCategories is guaranteed to be non-empty at this point due to form validation
      await createArticle({
        ...data,
        categories: parsedCategories,
      });

      toast.success("Article created");
      form.reset();
      setCategoriesCsv("");
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
        {!importGen && (
          <Button onClick={() => setImportGen(true)}>Generate with ai</Button>
        )}
        <br />

        {
          //Importeringskomponent:
          importGen && (
            <Genai
              setter={setImportedArticle}
              close={close}
              img={false}
            ></Genai>
          )
        }
        <br />
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
                    <ForwardRefEditor
                      markdown={field.value || ""}
                      {...field}
                      ref={ref}
                      key={editorKey}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Categories (CSV) bound to the "categories" field for proper validation */}
            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories (CSV)</FormLabel>
                  <FormControl>
                    <Input
                      value={categoriesCsv}
                      onChange={(e) => {
                        setCategoriesCsv(e.target.value);
                      }}
                      onBlur={() => {
                        const parsed = parseCategories(categoriesCsv);
                        field.onChange(parsed); // update the array in form on blur
                        setCategoriesCsv(parsed.join(", "));
                      }}
                      placeholder="e.g. News, Sports, Technology"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image URL */}
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
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
