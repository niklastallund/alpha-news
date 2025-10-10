"use server";

import axios from "axios";

import * as ch from "cheerio";

export type AiToolsType = {
  title: string;
  description: string;
  url: string;
  img: string;
};

export async function getNewestTools(): Promise<{
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
      .slice(0, 18)
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

export async function getAIArticle() {
  // So first we scrap all the news!
  // Then make an API call with it all, returning it as JSON from gemini.
  //
}
