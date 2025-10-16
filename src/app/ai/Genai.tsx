"use client";

import { useState, useEffect } from "react";
import { dbg_focusOnImage, generateArticle, GeneratedArticle } from "./ai";
import Markdown from "react-markdown";
import z from "zod";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import MultiselectWithAdd from "./MultiselectBox";

// This component generates an article based on a prompt and a category. You can also set temp. After generation, you can import it.
// THe import it handled by the PASSED setter function, so that is handled by the parent, this component only passes the generated
// article as the type GeneratedArticle.
// The idea is that this component is visible based an a state in the parent. So pass a close function to close on import, handled here after pressing import.
// If you also want to generate an img, this is up to the parent to tell (set img=true).
//

interface Props {
  setter: (article: GeneratedArticle) => void;
  close: () => void;
  img?: boolean;
}

// Zod schema:
const GenAiSchema = z.object({
  prompt: z.string(),
  temp: z.string().regex(/^(?:0(?:[.,]\d+)?|1(?:[.,]0+)?)$/, {
    message: "Temp måste vara mellan '0' och '1.0' (använd punkt eller komma).",
  }),
  words: z.string(),
  category: z.array(z.string()).optional(),
  img: z.string(),
});

// Så designen här tänekr jag mig att den ska vara som en dialog som öppnas ifrån formulärsidan.

export default function Genai({
  setter,
  close: closeFun = () => null,
  img = false,
}: Props) {
  const genForm = useForm<z.infer<typeof GenAiSchema>>({
    resolver: zodResolver(GenAiSchema),
    defaultValues: {
      prompt: "",
      temp: "0.7",
      words: "1000",
      category: [], // Maybe here we get all the cats from db? Yes.
      img: "true",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");

  const [article, setArticle] = useState<GeneratedArticle | undefined>();

  const generate = async (
    formData: FormData
  ): Promise<{ success: boolean; msg: string }> => {
    const prompt = (formData.get("prompt") as string) ?? "";
    const category = formData.get("category") as string;
    const temp = (formData.get("temp") as string) ?? "0.7";
    const words = (formData.get("words") as string) ?? "800";
    const img: boolean =
      (formData.get("img") as string) === "true" ? true : false;
    setLoading(true);

    // focusOnImage
    setMsg("Generating article... Can take a while");

    const art = await generateArticle(
      prompt,
      category,
      Number.parseFloat(temp.replace(",", ".")),
      img,
      words
    );

    // const art = await dbg_focusOnImage();

    if (art.success) {
      setArticle(art.data);
      setLoading(false);
      return { success: true, msg: "Generated article." };
    } else {
      setLoading(false);
      return { success: false, msg: art.msg ?? "Something went wrong" };
    }
  };

  async function genSub(values: z.infer<typeof GenAiSchema>) {
    const formData = new FormData();
    formData.append("prompt", values.prompt);
    formData.append("category", values.category?.join(",") ?? "");
    formData.append("temp", values.temp);
    formData.append("img", values.img);

    const result = await generate(formData);

    setMsg(result.msg);
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Generate article</CardTitle>
          <CardDescription>
            Using gemini for text and open AI for image.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...genForm}>
            <form onSubmit={genForm.handleSubmit(genSub)} className="space-y-3">
              <FormField
                control={genForm.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt (Write an article about:)</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={genForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      {/* <Input type="text" {...field} /> */}

                      <MultiselectWithAdd
                        {...field}
                        data={["1", "2"]}
                        values={["Sport", "Somethingelse"]}
                        placeholder="Category"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={genForm.control}
                name="words"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>~ Word count:</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={100}
                        max={10000}
                        step={1}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={genForm.control}
                name="temp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Temp (creativity: {Number.parseFloat(field.value) * 100}%)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={1}
                        step={0.1}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={genForm.control}
                name="img"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Generate image</FormLabel>
                    <FormControl>
                      <Checkbox
                        className="w-10 h-10 p-2"
                        checked={field.value === "true"}
                        {...field}
                        onCheckedChange={(checked: boolean) => {
                          field.onChange(checked ? "true" : "false");
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={genForm.formState.isSubmitting || loading}
                className="bg-blue-500 cursor-pointer p-3 w-full"
              >
                Generate
              </Button>

              {(genForm.formState.isSubmitting || loading) && <Loader />}
            </form>
          </Form>
          <br />
          {msg && (
            <div className=" rounded-lg w-full p-2 bg-amber-200 text-black mx-auto text-center">
              <p>{msg}</p>
            </div>
          )}
          {article && (
            <div>
              <br />
              <span className="font-bold">Preview article</span>
              <br />
              <br />
              <span className="text-2xl">Headline: {article?.headline}</span>
              <br />
              <br />
              Category: {article?.category}
              <br />
              <br />
              <span className="italic">Summery: {article?.summery}</span>
              <br />
              <br />
              Content:
              <Markdown>{article?.content}</Markdown>
              <br />
              <br />
              Img: {article?.imageUrl}
              <br />
              {article?.imageUrl && (
                <Image
                  src={article?.imageUrl}
                  width={512}
                  height={512}
                  alt={"poster image for " + article.headline}
                />
              )}
            </div>
          )}
          <br />
          <div className="w-full flex justify-between">
            <Button
              className="bg-red-300 text-black"
              onClick={() => closeFun()}
            >
              Discard
            </Button>
            <Button
              className="bg-green-500 "
              disabled={!article}
              onClick={() => {
                if (article) setter(article);
                closeFun();
              }}
            >
              Import to form
            </Button>{" "}
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
