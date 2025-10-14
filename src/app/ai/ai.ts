"use server";

import { google } from "@ai-sdk/google";
import { googleTools } from "@ai-sdk/google/internal";
import { generateObject, generateText } from "ai";
import { title } from "process";
import { z } from "zod";
import { ca } from "zod/v4/locales";

// So this we need for image generation
import { experimental_generateImage as generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';

// For uploading
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});



const articlePromptSchema = z.object({
    headline: z.string(),
    summery: z.string(),
    content: z.string(),
})

export type GeneratedArticleBase = {
    headline: string;
    summery: string;
    content: string;
    category: string;
}

export type GeneratedArticle = {
    headline: string;
    summery: string;
    content: string;
    category: string;
    imageUrl: string;
}


// ai npm:
// npm install ai
// npm install @ai-sdk/google

// Se ai sdk docs https://ai-sdk.dev/docs/getting-started/installation

async function genPureArticle(prompt:string, category:string, temp:number = 0.7) {

    const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        tools: {
            google_search: google.tools.googleSearch({}),
        },
        prompt: `Write an article about ${prompt} in category ${category}. min 800 max 2500 characters. Write in english. Make it interesting and engaging. Use google_search tool to get the latest information about ${prompt} and the category ${category}. Use the information from the search to make the article more interesting and engaging. Use the information from the search to make the article more accurate and up-to-date. Use the information from the search to make the article more relevant to the category ${category}.`,
        temperature: temp,
    })

    return text;

}



/**
 * 
 * @param prompt 
 * @param category 
 * @returns 
 */
async function gererateNewsObject(prompt:string, category: string, temp:number = 0.7) : Promise<GeneratedArticleBase> {

    const article = await genPureArticle(prompt, category, temp);

   const { object } = await generateObject({
        model: google("gemini-2.5-flash"),
        // Ändra prompten till denna:
        prompt: `Based on "${article}" that is an article in the category ${category}, create three fields: title, summery och content. Title should be a good headline between 10 and 100 chars suitable for the category ${category} in a newspaper. Summery should be a brief summary of the article between 100 and 400 chars. Content should be like the article, but with MD formatting, min 800 chars and max 2500 chars. Only return JSON format with these three fields and without any other text.`,

        schema: articlePromptSchema
    })



    return {...object, category: category};
}
/**
 * Genererar en bild med DALL-E 3 baserat på artikelns rubrik och sammanfattning,
 * och laddar sedan upp den till Cloudflare R2.
 * @param article Det genererade artikelobjektet.
 * @returns URL till den uppladdade bilden.
 */
async function generateImageForArticle(article: GeneratedArticleBase): Promise<string> {

    // // Steg 1: Generera bilden med DALL-E 3
    // console.log("Generating image...");
    // const { image } = await generateImage({
    //     model: openai.image('dall-e-3'),
    //     prompt: `Generate a high-quality, professional, and visually engaging image for a news article titled "${article.headline}" with the summary "${article.summery}". The style should be suitable for a newspaper in the category ${article.category}.`,
    //     size: '1024x1024' 
    // });

    // // Använd Uint8Array direkt för att skapa en Buffer för uppladdning.
    // // Detta är det mest effektiva och korrekta sättet.
    // const imageBuffer = Buffer.from(image.base64, 'base64');
    // const contentType = 'image/png'; 
    
    // const filename = `art${Date.now()}_${crypto.randomUUID()}.png`;


    // // Ladda upp bild
    
    // console.log("Uploading image...");
    // try {
    //     await s3Client.send(
    //         new PutObjectCommand({
    //             Bucket: process.env.R2_BUCKET_NAME,
    //             Key: filename,
    //             Body: imageBuffer,
    //             ContentType: contentType,
    //         })
    //     );
    //     console.log(`Image uploaded successfully to R2: ${filename}`);
    // } catch (error) {
    //     console.error("Error uploading image to R2:", error);
    //     // Kasta om felet för att stoppa processen
    //     throw new Error("Failed to upload image to R2 storage."); 
    // }

    // // Skapa och returnera den publika URL:en
    // const publicUrl = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${filename}`;
    // // OBS: Du kan behöva en anpassad domän (t.ex. `https://pub.example.com/`) om du har konfigurerat R2 med en.
    return "publicUrl";
}




/**
 * Generates a news article based on the provided prompt and category.
 * @param prompt Enter what the articlas is about, example ai in school. 
 * @param category Enter the category of the article.
 * @returns An object containing the headline, summery, content, category, and an imageUrl.
 */
export async function generateArticle(prompt:string, category: string, temp:number) : Promise<GeneratedArticle> {

    const articleBase = await gererateNewsObject(prompt, category, temp);

    return {...articleBase, imageUrl: await generateImageForArticle(articleBase)}

}