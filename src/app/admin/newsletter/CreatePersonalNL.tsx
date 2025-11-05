"use client";

import { marked } from "marked";
import { ForwardRefEditor } from "@/components/ForwardRefEditor";
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
import {
  gererateNewsletter,
  gereratePersonalNewsletter,
  getNLMails,
  sendPersonalNewsletter,
} from "../../../lib/actions/newsletter";
import Loader from "@/components/Loader";
import { sendNewsletters } from "../../../lib/actions/newsletter";
import { ResultPatternType } from "@/lib/actions/ai";
import { newsLetterSchema, personalNewsLetterSchema } from "./nltypesschemas";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  mails: string[];
}

export default function CreatePersonalNewsletter({ mails }: Props) {
  const ref = useRef<MDXEditorMethods>(null);
  const [editorKey, setEditorKey] = useState<string>(Math.random().toString()); // Lägg till ett state för nyckeln

  const [loadcBai, setLoadcBai] = useState<boolean>(false);

  const [sending, setsending] = useState<boolean>();
  const [sendMsg, setsendMsg] = useState<string | string[]>();

  useEffect(() => {
    const writeNL = async () => {
      if (watchedData[2] === undefined) {
        alert("You must pick a mail");
        return;
      }

      const gcBai = await gereratePersonalNewsletter(watchedData[2]);

      if (gcBai.success && gcBai.data) {
        ref.current?.setMarkdown(gcBai.data.content);
        form.setValue("headline", gcBai.data.headline);
        form.setValue("content", gcBai.data.content);
        setEditorKey(Math.random().toString());
      } else {
        alert(gcBai.msg);
      }
      setLoadcBai(false);
    };

    if (loadcBai) writeNL();
  }, [loadcBai]);

  const form = useForm<z.infer<typeof personalNewsLetterSchema>>({
    resolver: zodResolver(personalNewsLetterSchema),
    defaultValues: {
      user: undefined,
      headline: "",
      content: "",
    },
  });

  async function nlSub(values: z.infer<typeof personalNewsLetterSchema>) {
    // Gör om till HTML och en text-fall back.
    setsendMsg("");
    setsending(true);
    if (
      values.content.trim().length === 0 ||
      values.headline.trim().length === 0 ||
      values.user.trim().length === 0
    ) {
      alert("You need to have a headline and content and user");
      setsending(false);
      return;
    }
    // DO SHIT
    const sendNl = await sendPersonalNewsletter(
      values.user,
      values.headline,
      values.content
    );

    if (sendNl.success) {
      setsendMsg("Newsletter was sent.");
      setsending(false);
    } else {
      setsendMsg(sendNl.msg);
      setsending(false);
    }

    // Skicka med nodemailer :)

    // newsletter sub. Hmm..
  }

  const session = useSession();
  if (
    !session ||
    (session.user?.role !== "admin" && session.user?.role !== "employee")
  ) {
    return "You need to be admin or employee";
  }

  const watchedData = form.watch(["headline", "content", "user"]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Write a personal newsletter.</CardTitle>
        </CardHeader>
        <CardContent>
          {sending ? (
            <div>
              Sending... {sendMsg}
              <Loader></Loader>
            </div>
          ) : (
            <div>
              {sendMsg && (
                <div className="bg-amber-200 text-black p-2 rounded-lg max-h-[50vh] overflow-y-scroll mb-10">
                  {sendMsg}
                </div>
              )}
              <Button
                type="button"
                onClick={() => setLoadcBai(true)}
                disabled={loadcBai || watchedData[2] === undefined}
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
                    name="user"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Newsletter subscribers:</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value === "none" ? undefined : value)
                          }
                          defaultValue={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>User email</SelectLabel>
                              {mails?.length === 0 && session.user?.email && (
                                <SelectItem
                                  key={crypto.randomUUID()}
                                  value={session.user?.email}
                                >
                                  {session.user?.email}
                                </SelectItem>
                              )}
                              {mails?.map((m) => (
                                <SelectItem key={crypto.randomUUID()} value={m}>
                                  {m}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
              Visit:{" "}
              <a href="https://ethereal.email/messages" target="_blank">
                https://ethereal.email/messages
              </a>{" "}
              to see the email.
              <br />
              {/* Preview:
              <div>
                <h1>{watchedData[0]}</h1>
                <br />
              </div>
              <br />
              <div>{marked.parse(watchedData[1])}</div> */}
            </div>
          )}
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
