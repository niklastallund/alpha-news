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
      <div className="flex gap-12 text-lg font-medium tracking-wide">
        <span> React Fast Marquee är enkel ticker!</span>
        <span> Lägg till flera meddelanden med mellanrum.</span>
        <span> Lägg till flera meddelanden här.</span>
      </div>
    </Marquee>
  </div>
);

export default Ticker;
