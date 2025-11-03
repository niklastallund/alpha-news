"use client";

import { marked } from "marked";
import { ForwardRefEditor } from "@/components/ForwardRefEditor";
import Page from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/SessionProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { gererateNewsletter } from "./newsletter";
import Loader from "@/components/Loader";

export const newsLetterSchema = z.object({
  headline: z.string(),
  content: z.string(),
});

export default function CreateNewsletter() {
  const ref = useRef<MDXEditorMethods>(null);
  const [editorKey, setEditorKey] = useState<string>(Math.random().toString()); // Lägg till ett state för nyckeln

  const [cBai, setcBai] = useState(); // Är lite trött så ba döper saker här märker jag. created by ai (c b ai).
  const [loadcBai, setLoadcBai] = useState<boolean>(false);

  useEffect(() => {
    const writeNL = async () => {
      const gcBai = await gererateNewsletter();

      if (gcBai.success) {
        ref.current?.setMarkdown(gcBai.data.content);
        form.setValue("headline", gcBai.data.headline);
        form.setValue("content", gcBai.data.content);
      } else {
        alert(gcBai.msg);
      }
      setLoadcBai(false);
    };

    if (loadcBai) writeNL();
  }, [loadcBai]);

  const form = useForm<z.infer<typeof newsLetterSchema>>({
    resolver: zodResolver(newsLetterSchema),
    defaultValues: {
      headline: "",
      content: "",
    },
  });

  async function nlSub(values: z.infer<typeof newsLetterSchema>) {
    alert(JSON.stringify(values));

    // Gör om till HTML och en text-fall back.

    // Skicka med nodemailer :)

    // newsletter sub. Hmm..
  }

  const session = useSession();
  if (session.user?.role !== "admin")
    return (
      <Page>
        <div>You need to be admin</div>
      </Page>
    );

  const watchedData = form.watch(["headline", "content"]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Write a newsletter for all subscribers.</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            onClick={() => setLoadcBai(true)}
            disabled={loadcBai}
          >
            Let ai write
          </Button>
          <br />
          {loadcBai && <Loader />}
          <br />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(nlSub)} className="space-y-3">
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                        placeholder="Write the content using markdown..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Send!</Button>
            </form>
          </Form>
          <br />
          Preview:
          <div>
            <h1>{watchedData[0]}</h1>
            <br />
          </div>
          <br />
          <div>{marked.parse(watchedData[1])}</div>
        </CardContent>
      </Card>
    </div>
  );
}

/*
fix: nodemailer

// Server Action (eller API-rutt)

import { marked } => 'marked';
// ... övriga imports (nodemailer, etc.)

async function handleNewsletterSend(formData) {
    const headline = formData.get('headline');
    const markdownContent = formData.get('content');

    // 1. Konvertera Markdown till HTML
    const convertedBodyHtml = marked.parse(markdownContent);

    // 2. Skapa det fullständiga HTML-innehållet
    // BÄTTRE METOD: Använd en template-sträng för att inkludera rubriken och det konverterade innehållet
    const fullHtmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>${headline}</h1>
            <hr style="border: 0; border-top: 1px solid #ccc; margin-bottom: 20px;">
            
            <div>
                ${convertedBodyHtml}
            </div>
            
            <p style="margin-top: 30px; font-size: 0.8em; color: #777;">
                © 2025 Alpha News.
            </p>
        </div>
    `;

    // 3. Konfigurera mailOptions och skicka via Nodemailer
    const mailOptions = {
        // ... från, till, ämne, etc.
        subject: headline,
        
        // Mycket viktigt: Sätt din HTML-sträng i 'html'-fältet
        html: fullHtmlContent, 
        
        // Det är fortfarande bra att inkludera en ren text-version
        text: `${headline}\n\n${markdownContent}`, 
    };

    // await transporter.sendMail(mailOptions);
    // ...
}
*/
