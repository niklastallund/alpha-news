"use server";

import * as dotenv from "dotenv";
dotenv.config();

import axios from "axios";

import * as ch from "cheerio";

export type AiToolsType = {
  title: string;
  description: string;
  url: string;
  img: string;
};

export async function getNewestTools(slice: number = 18): Promise<{
  status: string | number | boolean;
  msg: string;
  tools?: AiToolsType[];
}> {
  // Scrap the newest tools from futuretools.io

  try {
    const { data, status } = await axios.get("https://www.futuretools.io");

    console.log("Fetching with status " + status); // I am thinking here to handle if status not ok.

    // So this is the "scrapper" :P
    const $ = ch.load(data);

    const tools: AiToolsType[] = []; // Setting unknown for now.

    // So this is the selector:
    const sel = ".tool";

    // Get the first 10, and go inside.
    $(sel)
      .slice(0, slice)
      .each((i, elm) => {
        // Create a Cheerio wrapper.
        const $el = $(elm);

        // This is based on:
        /*
<div role="listitem" class="tool tool-home w-dyn-item w-col w-col-4">
  <div class="w-embed">
    <input type="hidden" class="jetboost-list-item" value="bidventor" />
  </div>
  <div class="div-block-58">
    <a
      href="/tools/bidventor"
      class="tool-item-link-block---new tool-item-link-block---home w-inline-block"
      ><img
        src="https://cdn.prod.website-files.com/63994dae1033718bee6949ce/68e46abae1793a38fb533905_og-image.png"
        loading="lazy"
        alt=""
        sizes="(max-width: 479px) 96vw, (max-width: 767px) 97vw, (max-width: 991px) 31vw, 33vw"
        srcset="
          https://cdn.prod.website-files.com/63994dae1033718bee6949ce/68e46abae1793a38fb533905_og-image-p-500.png   500w,
          https://cdn.prod.website-files.com/63994dae1033718bee6949ce/68e46abae1793a38fb533905_og-image-p-800.png   800w,
          https://cdn.prod.website-files.com/63994dae1033718bee6949ce/68e46abae1793a38fb533905_og-image-p-1080.png 1080w,
          https://cdn.prod.website-files.com/63994dae1033718bee6949ce/68e46abae1793a38fb533905_og-image.png        1200w
        "
        class="tool-item-image---new tool-item-image---home"
    /></a>
    <div class="div-block-59">
      <div class="tool-item-text-link-block---new flex-center">
        <a href="/tools/bidventor" class="tool-item-link---new">BidVentor</a
        ><a
          href="https://futuretools.link/bidventor-com"
          target="_blank"
          class="tool-item-new-window---new w-inline-block"
          ><div class="html-embed-7 w-embed">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h7v2H5v14h14v-7h2v7q0 .825-.588 1.413T19 21H5Zm4.7-5.3l-1.4-1.4L17.6 5H14V3h7v7h-2V6.4l-9.3 9.3Z"
              ></path>
            </svg></div
        ></a>
      </div>
      <div class="tool-item-description-box---new">
        A tool that optimizes Amazon ad campaigns.
      </div>
      <div class="collection-list-wrapper-9 w-dyn-list">
        <div role="list" class="collection-list-8 w-dyn-items">
          <div role="listitem" class="collection-item-5 w-dyn-item">
            <a
              href="https://www.futuretools.io/?tags=marketing"
              class="link-block-7 w-inline-block"
              ><div class="text-block-53">Marketing</div></a
            >
          </div>
        </div>
      </div>
      <div class="list-upvote jetboost-toggle-favorite-vd2l">
        <div class="list---not-upvoted jetboost-list-item-hide">
          <a href="#" class="link-block-15 w-inline-block"
            ><img
              src="https://cdn.prod.website-files.com/639910cce4b41d2a9b3e96fb/63ad0e8e6c21e622aac34766_Up%20Arrow%20Inactive.webp"
              loading="lazy"
              alt=""
              class="image-19"
            />
            <div class="text-block-52 jetboost-item-total-favorites-vd2l">
              2
            </div></a
          >
        </div>
        <div class="list---upvoted" style="display: block">
          <a href="#" class="link-block-15 w-inline-block"
            ><img
              src="https://cdn.prod.website-files.com/639910cce4b41d2a9b3e96fb/63ad0e8e6c21e618d6c34765_Up%20Arrow%20Active.webp"
              loading="lazy"
              alt=""
              class="image-19"
            />
            <div class="text-block-52 jetboost-item-total-favorites-vd2l">
              2
            </div></a
          >
        </div>
        <div
          class="list---not-upvote-loading jetboost-list-item-hide"
          style="display: block"
        >
          <a href="#" class="link-block-15 w-inline-block"
            ><img
              src="https://cdn.prod.website-files.com/639910cce4b41d2a9b3e96fb/63ad0e8e6c21e622aac34766_Up%20Arrow%20Inactive.webp"
              loading="lazy"
              alt=""
              class="image-19"
            />
            <div class="text-block-52 jetboost-item-total-favorites-vd2l">
              2
            </div></a
          >
        </div>
      </div>
    </div>
  </div>
</div>

*/

        // Scraping magic :)
        const title = $el
          .find(".tool-item-link---new, .tool-item-link")
          .first()
          .text()
          .trim();
        const description = $el
          .find(".tool-item-description-box---new, .tool-item-description-box") // Maybe the ---new will dissappear? So a fallback.
          .first()
          .text();
        const url =
          $el
            .find(".tool-item-new-window---new, .tool-item-new-window")
            .first()
            .attr("href") || "";
        const img =
          $el
            .find(".tool-item-link-block---new img, .tool-item-link-block img")
            .first()
            .attr("src") || "";

        tools.push({ title, description, url, img });
      });

    return { status: status, msg: "Scrapped.", tools: tools };
  } catch (e) {
    return { status: false, msg: JSON.stringify(e), tools: [] };
  }
}

export type aiArticleType = {
  title: string;
  date: string;
  img: string;
  content: string;
};

export async function getAIArticle(): Promise<{
  status: string | number | boolean;
  msg: string;
  article?: aiArticleType | null;
}> {
  // So first we scrap all the news.

  try {
    const { data, status } = await axios.get("https://www.futuretools.io/news");

    console.log("Fetching with status " + status); // I am thinking here to handle if status not ok.

    // So this is the "scrapper" :P
    const $ = ch.load(data);

    // JA JAG ÄR VÄRDELÖS

    const sel = ".w-dyn-items";

    const rawHtmlContent = $(sel).html();

    if (!rawHtmlContent || rawHtmlContent.trim().length === 0)
      return { status: false, msg: "Could not find the '.w-dyn-items' " };

    // fix
    console.log(
      `Successfully scraped raw HTML content (${rawHtmlContent.length} characters). Generating article...`
    );

    const article = await heyGemini(rawHtmlContent);

    return { status: true, msg: "success", article };
  } catch (e) {
    return { status: false, msg: JSON.stringify(e) };
  }
  // Then make an API call with it all, returning it as an article with {title, date, img, content} JSON from gemini. usiung <pre>.
  //
}

async function heyGemini(html: string): Promise<aiArticleType | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("No gemini API found.");
    return null;
  }

  const MODEL = "gemini-2.5-flash-preview-05-20";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  const articleSchema = {
    type: "OBJECT",
    properties: {
      title: {
        type: "STRING",
        description:
          "A compelling, catchy title for the weekly AI news summary.",
      },
      date: {
        type: "STRING",
        description: "Today's date in YYYY-MM-DD format.",
      },
      img: {
        type: "STRING",
        description:
          "A placeholder image URL for the article, e.g., https://placehold.co/1200x600/25333f/ffffff?text=AI+News+Summary",
      }, // So this i will change later to a generator. (fix)
      content: {
        type: "STRING",
        description:
          "A cohesive, five-paragraph summary of all news, grouped by major theme (e.g., Google, OpenAI, Acquisitions). Use markdown for readability.",
      },
    },
    required: ["title", "date", "img", "content"],
    propertyOrdering: ["title", "date", "img", "content"],
  };

  // (generated from gemini himself for a good explaination for gemini to know what to do:)
  const systemPrompt = `You are a world-class technology journalist specializing in AI. Analyze the following raw HTML content, which contains a list of recent AI news headlines. The headlines are in elements with class '.text-block-27', dates are in '.text-block-30', and sources are in '.text-block-28'. Parse this information. Generate a single, cohesive, and engaging article summarizing the trends and key announcements. The summary must be approximately 5 paragraphs long and focus on the dominant themes. Return the output STRICTLY as a JSON object matching the provided schema.`;

  const userQuery = `Summarize the news content found within this raw HTML: \n\n${html}`;

  // So this is whats will be sent to gemini:
  const payload = {
    contents: [
      {
        parts: [
          {
            text: userQuery,
          },
        ],
      },
    ],
    systemInstruction: {
      parts: [
        {
          text: systemPrompt,
        },
      ],
    },
    // 3. The generationConfig is what forces the structured JSON output so we get it as our article type :)
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: articleSchema,
    },
  };

  // Ok, so i guess i can now call gemini :)

  try {
    // Hey gemini! (sending the payload:)
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log("GEMINI SAYS: " + JSON.stringify(result));

    // So this is based the form of data we get back from gemini:
    const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!jsonText) {
      console.log(
        "GEMINI DID NOT ANSWERE ANYTHING IN EXPECTED candidates etc."
      );
    }

    const cleanJsonString = (text: string): string => {
      // 1. Remove markdown fences (```json) if present
      let cleaned = text.replace(/^```json\s*|```\s*$/g, "").trim();

      // 2. Attempt to isolate the main JSON object { ... }
      const openBraceIndex = cleaned.indexOf("{");
      const closeBraceIndex = cleaned.lastIndexOf("}");

      if (
        openBraceIndex !== -1 &&
        closeBraceIndex !== -1 &&
        closeBraceIndex > openBraceIndex
      ) {
        // Extract the content from the first '{' to the last '}'
        cleaned = cleaned.substring(openBraceIndex, closeBraceIndex + 1);
      }

      return cleaned;
    };

    const cleanedJsonText = cleanJsonString(jsonText);

    // The response is a stringified JSON object that needs to be parsed
    try {
      const parsedJson = JSON.parse(cleanedJsonText);
      return parsedJson as aiArticleType;
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      // Throw an error with the problematic text snippet for easier debugging
      throw new Error(
        `Gemini returned an invalid JSON structure. Failed to parse text starting with: "${cleanedJsonText.substring(
          0,
          50
        )}..."`
      );
    }

    // // So i guess we see now if we can return a article :)
    // try {
    //   const parsedJson = JSON.parse(jsonText);
    //   return parsedJson as aiArticleType; // YEEY ?
    // } catch (e) {
    //   console.error("Failed to JSON \n" + e);
    //   return null;
    // }
  } catch (e) {
    console.log("GEMINI ERROR:\n" + JSON.stringify(e));
    return null;
  }

  // const theDate = new Date();
  // const theImg = "https://generatedaiimg";
  // const theContent = "OK OK OK";
  // const theTitle = "THe title";

  // return {
  //   date: theDate.toLocaleDateString(),
  //   img: theImg,
  //   content: theContent,
  //   title: theTitle,
  // };
}
