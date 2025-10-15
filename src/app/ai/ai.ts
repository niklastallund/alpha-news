"use server";

import { createAzure } from "@ai-sdk/azure";
import { google } from "@ai-sdk/google";
import { googleTools } from "@ai-sdk/google/internal";
import { generateObject, generateText, experimental_generateImage } from "ai";
import { title } from "process";
import { success, z } from "zod";
import { ca } from "zod/v4/locales";

// So this we need for image generation
import { experimental_generateImage as generateImage } from "ai";
import { openai } from "@ai-sdk/openai";

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

// This is only for the ai how to form the object, so img is not here it is its own function.
const articlePromptSchema = z.object({
  headline: z.string(),
  summery: z.string(),
  content: z.string(),
});

export type GeneratedArticleBase = {
  headline: string;
  summery: string;
  content: string;
  category: string;
};

export type GeneratedArticle = {
  headline: string;
  summery: string;
  content: string;
  category: string;
  imageUrl?: string;
};

/**
 * So this is the type for handling errors along the way (result-pattern),
 * so if success it will contain data otherwise msg containing err-info.
 * T usally is Result<string>, but if you expect another type just change T lile Promise<ResultPatternType<string | boolean>> or whatever.
 */
export type ResultPatternType<T, Err = string> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      msg: Err;
    };

// För att snabbt felsöka image-generation, anropa denna istället.
export async function dbg_focusOnImage(): Promise<
  ResultPatternType<GeneratedArticle>
> {
  const fakeNews: GeneratedArticle = {
    category: "test",
    content: "Test article",
    headline: "Lexicon programming school",
    summery: "a school in Linköping teaching adults about programming.",
  };

  const img = await generateImageForArticle(fakeNews);

  if (!img.success) return { success: false, msg: "Nope." };

  return { success: true, data: { ...fakeNews, imageUrl: img.data } };
}

/**
 * Genererar en bild med DALL-E 3 baserat på artikelns rubrik och sammanfattning,
 * och laddar sedan upp den till Cloudflare R2.
 * @param article Det genererade artikelobjektet.
 * @returns URL till den uppladdade bilden.
 */
async function generateImageForArticle(
  article: GeneratedArticleBase
): Promise<ResultPatternType<string>> {
  // // Creating the azure

  try {
    const apiKey = process.env.AZURE_API_KEY;
    const resourceEndpoint = process.env.AZURE_RESOURCE_ENDPOINT;

    if (!apiKey) {
      return {
        success: false,
        msg: "AZURE_API_KEY or AZURE_RESOURCE_ENDPOINT is not set in environment variables.",
      };
    }

    const deploymentName = "dall-e-3";
    const apiVersion = "2024-02-01";

    const azure = createAzure({
      apiKey: apiKey,

      baseURL: resourceEndpoint,

      apiVersion: apiVersion,

      useDeploymentBasedUrls: true,

      //         fetch: (input, init) => {
      //             const fullUrl = input.toString();
      //             console.log('Final Azure API Endpoint:', fullUrl);
      //             return fetch(input, init);
      // },
    });

    // Antar att den hämtar modellen baserat på "deploymentName" och att deploymentName är 'dall-e-3' och inte bar amodellnamnet?
    const imageModel = azure.image("dall-e-3");

    const imagePrompt = `A detailed, cinematic digital illustration for a news article with the headline: "${article.headline}" and the summary: "${article.summery}". The image should be visually engaging and relevant to the topic.`;

    console.log("Generating image...");

    const result = await generateImage({
      model: imageModel,
      prompt: imagePrompt,
      size: "1024x1024",
    });

    const image = result.image;

    const imageBuffer = Buffer.from(image.base64, "base64");
    const contentType = "image/png";
    const filename = `art_${crypto.randomUUID()}.png`;

    // Ladda upp bild
    console.log("Uploading image...");

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: filename,
        Body: imageBuffer,
        ContentType: contentType,
      })
    );
    console.log(`Image uploaded successfully to R2: ${filename}`);

    const imageUrl = `${process.env.R2_PUBLIC_URL}/${filename}`;

    // OBS: Du kan behöva en anpassad domän (t.ex. `https://pub.example.com/`) om du har konfigurerat R2 med en.

    return { success: true, data: imageUrl };
  } catch (e) {
    console.log(JSON.stringify(e));
    const errorMsg = e instanceof Error ? e.message : String(e);

    return { success: false, msg: "Pure article failed. " + JSON.stringify(e) };
  }
}

// ai npm:
// npm install ai
// npm install @ai-sdk/google
// Se ai sdk docs https://ai-sdk.dev/docs/getting-started/installation
async function genPureArticle(
  prompt: string,
  category: string,
  temp: number = 0.7,
  words: string = "800"
): Promise<ResultPatternType<string>> {
  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      tools: {
        google_search: google.tools.googleSearch({}),
      },
      prompt: `Write an MD formatted article about ${prompt} in the category ${category} in ${words} words. Write in english. Make it interesting and engaging. Use google_search tool to get the latest information about ${prompt} and the category ${category}. Use the information from the search to make the article more interesting and engaging. Use the information from the search to make the article more accurate and up-to-date. Use the information from the search to make the article more relevant to the category ${category}. Make it MD Formatted and with paragraphs.`,
      temperature: temp,
    });

    return { success: true, data: text };
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);

    return { success: false, msg: "Pure article failed. " + String(errorMsg) };
  }
}

/**
 *
 * @param prompt
 * @param category
 * @returns
 */
async function gererateNewsObject(
  prompt: string,
  category: string,
  temp: number = 0.7,
  words: string = "800"
): Promise<ResultPatternType<GeneratedArticle>> {
  const getPureArticle = await genPureArticle(prompt, category, temp, words);
  if (!getPureArticle.success)
    return { success: false, msg: "Could not generate pure article (step 1)" };

  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      // Ändra prompten till denna:
      prompt: `Based on "${getPureArticle.data}" that is an article in the category ${category}, create three fields: title, summery och content. Title should be a good headline between 10 and 100 chars suitable for the category ${category} in a newspaper. Summery should be a brief summary of the article between 100 and 400 chars. NO MD formatting in other fields that content. Content can be the article as it is, adjust if needd. It is important that you split the content into paragraphs, and add MD formatting to the content, the length of content should be ${words} words long. Content should not have a headline so no h1 there. Only return JSON format with these three fields and without any other text, and only MD formatting in content. Not so much bold in content.`,
      schema: articlePromptSchema,
    });

    return { success: true, data: { ...object, category: category } };
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);

    return {
      success: false,
      msg: "Object article failed. " + String(errorMsg),
    };
  }
}

/**
 * Generates a news article based on the provided prompt and category.
 * @param prompt Enter what the articlas is about, example ai in school.
 * @param category Enter the category of the article.
 * @returns An object containing the headline, summery, content, category, and an imageUrl.
 */
export async function generateArticle(
  prompt: string,
  category: string,
  temp: number,
  genImg: boolean = false,
  words: string
): Promise<ResultPatternType<GeneratedArticle>> {
  try {
    const articleBase = await gererateNewsObject(prompt, category, temp, words);
    if (!articleBase.success)
      return { success: false, msg: "Could not generate article as obj." };

    console.log("IMG?" + genImg);

    if (genImg) {
      const img = await generateImageForArticle(articleBase.data);
      if (!img.success)
        return { success: false, msg: "Could not generate image." };
      return {
        success: true,
        data: { ...articleBase.data, imageUrl: img.data },
      };
    }

    return { success: true, data: { ...articleBase.data } };
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);

    return {
      success: false,
      msg: "GenerateArticle failed. " + String(errorMsg),
    };
  }
}
