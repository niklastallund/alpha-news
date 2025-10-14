"use client"

import { useState, useEffect } from 'react'
import { generateArticle, GeneratedArticle } from './ai';
import Markdown from 'react-markdown'
import z from 'zod';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';

// This component generates an article based on a prompt and a category. You can also set temp. After generation, you can import it.
// THe import it handled by the PASSED setter function, so that is handled by the parent, this component only passes the generated
// article as the type GeneratedArticle.
// The idea is that this component is visible based an a state in the parent. So pass a close function to close on import, handled here after pressing import.
// If you also want to generate an img, this is up to the parent to tell (set img=true).

// 



interface Props {
  setter: (article: GeneratedArticle) => void, // So this is the parent
  close: () => void,
  img?: boolean
}





// Zod schema:
const GenAiSchema = z.object({
  prompt: z.string(),
  temp: z.string(), // numerisk sträng :) Kanske gör en regexkontroll så det följer formatet 0.0 - 1.0 som jag tror är giltigt. Formulär step 0.1 min-0 max-1 border gå
  category: z.string(),
})


// Så designen här tänekr jag mig att den ska vara som en dialog som öppnas ifrån formulärsidan.

export default function Genai( { setter, close: closeFun = () => null, img = false }: Props ) {



  const genForm = useForm<z.infer<typeof GenAiSchema>>({
    resolver: zodResolver(GenAiSchema),
    defaultValues: {
      prompt: "",
      temp: "0.7",
      category: "", // Maybe here we get all the cats from db?
    },
  });

    const [loading, setLoading] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>("");

    const [article, setArticle] = useState<GeneratedArticle | undefined >();



  const generate = async (formData:FormData) : Promise<{success: boolean, msg: string}> => {

      const prompt = formData.get("prompt") as string ?? "";
      const category = formData.get("category") as string;
      const temp = formData.get("temp") as string ?? "0.7";
      

      setLoading(true);
      
      const art = await generateArticle(prompt, category, Number.parseFloat(temp));

      if (art.article) {
        setArticle(art.article);
        setLoading(false);
        return {success: true, msg: "Generated article."}
      } else {
        return {success: false, msg: art.msg ?? "Something went wrong"}
      }
      

  }





    async function genSub(values: z.infer<typeof GenAiSchema>) {


      const formData = new FormData();
      formData.append("prompt", values.prompt);
      formData.append("category", values.category);
      formData.append("temp", values.temp);
  
      const result = await generate(formData);
  
      setMsg(result.msg);


    }
  


  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Generate article</CardTitle>
          <CardDescription>Using copilot</CardDescription>
        </CardHeader>
        <CardContent>



        <Form {...genForm}>
          <form onSubmit={genForm.handleSubmit(genSub)}>
            <FormField
              control={genForm.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
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
                    <Input type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={genForm.control}
              name="temp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>temp</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} max={1} step={0.1} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={(genForm.formState.isSubmitting || loading)}
              className="bg-green-500 cursor-pointer p-3 w-full"
            >
              Import
            </Button>

            {(genForm.formState.isSubmitting || loading) && <Loader/>}
          </form>
        </Form>

          <br/><span className="font-bold">Preview article</span>
          <br/><br/>
          Headline: {article?.headline}
          <br/><br/>
          Category: {article?.category}
          <br/><br/>
          Summery: {article?.summery}
          <br/><br/>
          Content: {article?.content}
          <br/><br/>
          Img: {article?.imageUrl}
          <br/><br/>
          <Button onClick={() => {if (article) setter(article); closeFun()}}>Import and close</Button>


        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  )
}
