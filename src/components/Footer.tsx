"use client";

import { MapPin, Phone, Building2 } from "lucide-react";

// Small footer component with 3 columns: Brand, Center, Contact
export function Footer() {
  return (
    <footer className="bg-background/95 border-t-2 border-border mt-5">
      <div className="mx-auto max-w-screen-xl py-6">
        <div className="flex flex-row md:items-start justify-between px-5 gap-4 lg:gap-72">
          {/* Brand (left) */}
          <div className="space-y-4 w-full md:w-1/3">
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed pr-4">
              A faux News page built with modern web technologies for a
              delightful reading experience about the latest AI slop Gemeni came
              up with with.
            </p>
          </div>

          {/* Center (middle) */}
          <div className="py-10 text-center w-full md:w-xl flex items-center justify-center">
            <div className="text-xs md:text-sm text-muted-foreground tracking-wide">
              <p>© 2025 Alpha News</p>
              <p>Built by Niklas • Tobias • Irina • Isuf </p>
            </div>
          </div>

          {/* Contact (right) */}
          <div className="space-y-4 w-full md:w-1/3">
            <ul className="space-y-3 text-xs md:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />{" "}
                <span>
                  1313 Alpha News Rd.
                  <br />
                  New Factsville, 65432
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Building2 />{" "}
                <span>In a random datacenter somewhere in Germany</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> <span>(555) FACTS-333</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
