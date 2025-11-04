"use server";

import { ResultPatternType } from "@/lib/actions/ai";
import { google } from "@ai-sdk/google";

import { generateObject, generateText, experimental_generateImage } from "ai";

import { prisma } from "@/lib/prisma";

import nodemailer from "nodemailer";
import { markdownToTxt } from "markdown-to-txt";
import { marked } from "marked";
import { getSessionData } from "./sessiondata";

import {
  newsletterMailSchema,
  newsletterMailSendSchema,
  newsLetterSchema,
  sentNLMailsReturnType,
} from "@/app/admin/newsletter/nltypesschemas";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendNewsletters(
  subject: string,
  mdtext: string
): Promise<ResultPatternType<sentNLMailsReturnType>> {
  // Check session and role.
  const session = await getSessionData();
  if (
    !session ||
    (session.user?.role !== "admin" && session.user?.role !== "employee")
  ) {
    return { success: false, msg: "You need to be admin or employee" };
  }

  try {
    const safeParseResult = await newsletterMailSchema.safeParseAsync({
      subject,
      mdtext,
    });

    if (!(await safeParseResult).success)
      return {
        success: false,
        msg: "Not valid data. " + JSON.stringify(safeParseResult.error?.issues),
      };

    // First get all emails to send to.
    const emails = await getNLMails();

    if (emails.length > 0) {
      const sentMails = await Promise.all(
        emails.map(async (mail) => {
          const sendTo = await sendEmailMD(mail, subject, mdtext);
          return { to: mail, data: sendTo };
        })
      );

      return { success: true, data: sentMails };
    } else {
      return {
        success: false,
        msg: "No subscribers of the newsletter was found.",
      };
    }
  } catch (e) {
    return { success: false, msg: JSON.stringify(e) };
  }
}

export async function sendEmailMD(
  to: string,
  subject: string,
  mdtext: string
): Promise<ResultPatternType<string>> {
  // So we will pass a text-version, and a html version.

  try {
    const parseResult = await newsletterMailSendSchema.safeParseAsync({
      to,
      subject,
      mdtext,
    });

    if (!parseResult.success) {
      // If validation fails, return early with the error details
      const errorMsg =
        "Validation Failed: " + JSON.stringify(parseResult.error.issues);
      console.error(errorMsg);
      return { success: false, msg: errorMsg };
    }

    // create text:
    const text = markdownToTxt(mdtext);
    // create html:
    const html = await marked.parse(mdtext);

    const send = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

    // console.log("\n\nsend returns " + JSON.stringify(send) + "\n\n");

    return { success: true, data: "Newsletter sent to " + to };
  } catch (e) {
    let errorDetails = "Unknown Error";
    if (e instanceof Error) {
      errorDetails = e.stack || e.message; // Get message and stack trace
    } else {
      errorDetails = JSON.stringify(e); // Fallback for non-Error objects
    }

    console.error(
      "Failed to send email. Content:" + mdtext + "\n\nError: " + errorDetails
    );

    // Return a useful message for the caller
    return {
      success: false,
      msg: `Failed to send email. Details: ${errorDetails.substring(
        0,
        100
      )}...`,
    };
  }
}

export async function getNLMails(): Promise<string[]> {
  const sessionData = await getSessionData();

  if (
    sessionData?.user?.role !== "admin" &&
    sessionData?.user?.role !== "employee"
  ) {
    console.log("You need to be admin or employee to get emails.");
    return [];
  }

  const emails = await prisma.user.findMany({
    where: { newsLetter: true },
    select: { email: true },
  });

  return emails.map((e) => e.email);
}

/**
 *
 * @returns An Generated newsletter!
 */
export async function gererateNewsletter(): Promise<
  ResultPatternType<{ headline: string; content: string }>
> {
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

  try {
    // So lets get the 5 latest articles, and the active date, and let ai create something based on that.

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      // Ändra prompten till denna:
      prompt: `Write a newsletter for the subscribers of a news site, based on the 5 latest articles: ${JSON.stringify(
        articles
      )}. And the latest articles for PRO subscribers is ${JSON.stringify(
        articlesPRO
      )}, so promote why a subscriber should get PRO access, based on the pro articles! 
      Create a JSON object with two fields:

{
  "headline": "10-50 char headline for a newsletter.",
  "content": "Full newsletter summerizing the latest articles.
}



CRITICAL: For the content field, use ACTUAL Markdown syntax.

Separate paragraphs with two real line breaks (important!).

- Use **text** for bold
- Use ##Heading for sections
- **DO NOT use the escape sequence \\n** anywhere in the content. Use literal, physical line breaks.
- Length: approximately between 500 - 800 words.
- NO h1 (#) heading in content

Example content structure:
Paragraph one with **bold text**.

Paragraph two continues here.

## Section Heading

More content here.`, // Added a clear instruction to use TWO line breaks
      schema: newsLetterSchema,
    });

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
