"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import Link from "next/link";

export type Headline = { id: number; text?: string }; // object with numeric id and optional text
type TickerProps = { headlines: Headline[] }; // expects an array of Headline objects

const Ticker: React.FC<TickerProps> = (
  { headlines = [] } // funktionell React-komponent som tar headlines och sätter en tom array
) => (
  <div className="bg-primary-foreground border-2 border-primary py-2 overflow-hidden rounded-lg shadow transition-colors duration-300 sticky top-18 z-10">
    <Marquee // ticker component: a client-side marquee that displays headlines
      speed={80}
      pauseOnHover
      delay={1}
      gradient={false}
      direction="left"
    >
      <div className="flex gap-24 text-lg font-medium tracking-wide pr-24">
        {headlines.length ? (
          headlines.map((h) => (
            <span key={h.id}>
              <Link
                href={`/article/${h.id}`} // rendered as Next.js Links to /article/:id
                className="text-black hover:underline dark:text-white"
              >
                {h.text ?? "Untitled"}
              </Link>
            </span>
          ))
        ) : (
          <span>No articles yet…</span>
        )}
      </div>
    </Marquee>
  </div>
);

export default Ticker;
