"use client";

import React from "react";
import Marquee from "react-fast-marquee";

const Ticker = () => (
  <div className="bg-white text-black border-2 border-red-600 py-2 overflow-hidden rounded-lg shadow">
    <Marquee
      speed={80} // hastighet (lägre = långsammare, högre = snabbare)
      pauseOnHover={true} // pausar när du håller musen över
      delay={1} // startfördröjning i sekunder
      gradient={false} // ingen gradient i kanterna
      direction="left" // riktning: 'left' eller 'right'
    >
      <div className="flex gap-24 text-lg font-medium tracking-wide pr-24">
        <span>
          {" "}
          BREAKING: Cats are unable to fly because they lack the necessary wing
          structure.
        </span>
        <span>
          Just Now: The Beatles announce reunion tour hours after John Lennon
          resurrection.
        </span>
        <span> {`WARNING: Do not drink bleach, it is dangerous.`} </span>
      </div>
    </Marquee>
  </div>
);

export default Ticker;
