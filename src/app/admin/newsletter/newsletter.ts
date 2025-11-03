"use server";

import { ResultPatternType } from "@/lib/actions/ai";
import { google } from "@ai-sdk/google";

import { generateObject, generateText, experimental_generateImage } from "ai";

import { prisma } from "@/lib/prisma";
import z from "zod";

const newsLetterSchemaS = z.object({
  headline: z.string(),
  content: z.string(),
});

/**
 *
 * @returns An Generated newsletter!
 */
export async function gererateNewsletter(): Promise<
  ResultPatternType<{ headline: string; content: string }>
> {
  console.log("Newsletter started...");

  const articles = await prisma.article.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { headline: true, summary: true },
  });

  const articlesPRO = await prisma.article.findMany({
    where: { onlyFor: "pro" },
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { headline: true, summary: true },
  });

  console.log("Articles" + JSON.stringify(articles));

  console.log("Now continuing...");

  try {
    // So lets get the 5 latest articles, and the active date, and let ai create something based on that.

    console.log("Starting");
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      // Ändra prompten till denna:
      prompt: `Write a newsletter for the subscribers of a news site, based on the 5 latest articles: ${JSON.stringify(
        articles
      )}. And the latest articles for PRO subscribers is ${JSON.stringify(
        articlesPRO
      )}, so promote why a subscriber should get PRO access! 
      Create a JSON object with two fields:

{
  "headline": "10-50 char headline for a newsletter.",
  "content": "Full newsletter summerizing the latest articles.
}

CRITICAL: For the content field, use ACTUAL Markdown syntax:
- Separate paragraphs with blank lines (press Enter twice)
- Use **text** for bold
- Use ##Heading for sections
- DO NOT use \\n - use real line breaks
- Length: approximately between 500 - 800 words.
- NO h1 (#) heading in content

Example content structure:
Paragraph one with **bold text**.

Paragraph two continues here.

## Section Heading

More content here.`,
      schema: newsLetterSchemaS,
    });

    console.log(JSON.stringify(object));

    return { success: true, data: { ...object } };
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    console.log(errorMsg);
    return {
      success: false,
      msg: "Object article failed. " + String(errorMsg),
    };
  }
}
