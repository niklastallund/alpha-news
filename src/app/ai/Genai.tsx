"use client";

import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import {
  generateArticle,
  GeneratedArticle,
  GeneratedArticleBase,
  generateImageForArticle,
} from "@/lib/actions/ai";
import { addCat } from "@/lib/actions/article";
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

import { Category } from "@/generated/prisma/wasm";
import { toast } from "sonner";
import { normalizeCategoryName } from "./MultiselectBox";

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
  categories: Category[];
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
  categories,
}: Props) {
  const genForm = useForm<z.infer<typeof GenAiSchema>>({
    resolver: zodResolver(GenAiSchema),
    defaultValues: {
      prompt: "",
      temp: "0.7",
      words: "800",
      category: [], // Maybe here we get all the cats from db? Yes.
      img: "true",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");

  const [generatedArticle, setGeneratedArticle] = useState<
    GeneratedArticle | undefined
  >();

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
      setGeneratedArticle(art.data);
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

  const addCategory = useCallback(async (s: string) => {
    // FIrst normalizeCategoryName. Then trim, just in case.
    const newCategory = await normalizeCategoryName(s).trim();

    const result = await addCat(newCategory);
    if (result.success) {
      // Try to add it to the value;
      const newVal = [
        ...(genForm.getValues("category") ?? []),
        result.data.name,
      ];

      genForm.setValue(
        "category",
        newVal.map((v) => v.toString())
      );
      toast("Added category " + newCategory + " to databse. 👍");
    } else {
      toast(
        "ℹ️ Failed adding category " +
          newCategory +
          " to databse. \n" +
          result.msg
      );
    }
  }, []);

  const [regenMsg, setregenMsg] = useState("");

  const generateImg = useCallback(async () => {
    setregenMsg("Re-generating image...");

    if (typeof generatedArticle === "undefined") {
      setregenMsg("");
      return;
    }

    const asTheRightType: GeneratedArticleBase = {
      headline: generatedArticle.headline,
      category: generatedArticle.category,
      content: generatedArticle.content,
      summary: generatedArticle.summary,
    };

    const newImg = await generateImageForArticle(asTheRightType);
    setregenMsg("Generated!");
    if (newImg.success) {
      setGeneratedArticle((prev) => {
        if (!prev) {
          return undefined;
        }
        return {
          ...prev,
          imageUrl: newImg.data ?? "",
        };
      });
      setregenMsg("Updated generated article.");
      setregenMsg("");
    } else {
      setregenMsg("Failed");
    }
  }, []);

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
                        data={categories?.map((c) => c.name)}
                        // values={categories?.map((c) => c.name)}
                        placeholder="Select categories"
                        adder={true}
                        adderFun={addCategory}
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
            <div className=" rounded-lg w-full p-2 bg-amber-300 text-black mx-auto text-center">
              <p>{msg}</p>
            </div>
          )}
          {generatedArticle && (
            <div>
              <br />
              <span className="font-bold">Preview article</span>
              <br />
              <br />
              <span className="text-2xl">
                Headline: {generatedArticle?.headline}
              </span>
              <br />
              <br />
              Category: {generatedArticle?.category}
              <br />
              <br />
              <span className="italic">
                Summary: {generatedArticle?.summary}
              </span>
              <br />
              <br />
              Content:
              <Markdown>{generatedArticle?.content}</Markdown>
              <br />
              <br />
              Img preview:
              <br />
              {generatedArticle?.imageUrl && (
                <div>
                  <Image
                    src={generatedArticle?.imageUrl}
                    width={512}
                    height={512}
                    alt={"poster image for " + generatedArticle.headline}
                  />
                  <br />
                  <div className="flex gap-1">
                    <Button
                      disabled={!!regenMsg}
                      className="bg-blue-400 text-black"
                      onClick={async () => generateImg()}
                    >
                      Re-generate
                    </Button>
                    {regenMsg && (
                      <div className="p-2 bg-amber-300 text-black rounded-lg">
                        {regenMsg}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <br />
          <div className="w-full flex justify-between">
            <Button
              className="bg-red-300 text-black"
              onClick={() => {
                genForm.reset();
                closeFun();
              }}
            >
              Discard
            </Button>
            <Button
              className="bg-green-500 "
              disabled={!generatedArticle}
              onClick={() => {
                if (generatedArticle) setter(generatedArticle);
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
