"use client";

import React from "react";
import Marquee from "react-fast-marquee";

type TickerProps = { headlines: string[] };
//  funktionell React-komponent som tar headlines och sätter en tom array
const Ticker: React.FC<TickerProps> = ({ headlines = [] }) => (
  <div className="background text-black border-2 border-primary py-2 overflow-hidden rounded-lg shadow dark:text-gray-100 transition-colors duration-300">
    <Marquee
      speed={80}
      pauseOnHover
      delay={1}
      gradient={false}
      direction="left"
    >
      <div className="flex gap-24 text-lg font-medium tracking-wide pr-24">
        {headlines.length ? (
          headlines.map((h, i) => <span key={i}>{h}</span>) // h= en rubrik, typ string, i=index
        ) : (
          <span>No articles yet…</span>
        )}
      </div>
    </Marquee>
  </div>
);

export default Ticker;
