"use client";

import * as React from "react";
import Link from "next/link";

type ContactItemProps = {
  href: string;
  title: string;
  subtitle?: string;
  ariaLabel?: string;
  children: React.ReactNode; // icon
};

function ContactItem({
  href,
  title,
  subtitle,
  ariaLabel,
  children,
}: ContactItemProps) {
  const isExternal = href.startsWith("http");
  const Wrapper = isExternal ? Link : "a";

  return (
    <div
      role="listitem"
      className="bg-card text-muted-foreground border-gray-400 dark:border-gray-600"
    >
      <Wrapper
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener" : undefined}
        aria-label={ariaLabel ?? title}
        className="group grid grid-cols-[auto_1fr] items-center gap-3 px-4 py-3
           rounded-lg outline-none transition-all duration-150
           hover:bg-accent hover:text-accent-foreground
           active:translate-y-px focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div
          className="grid h-7 w-7 place-items-center text-primary group-hover:text-primary/90"
          aria-hidden="true"
        >
          {children}
        </div>
        <div className="leading-tight text-muted-foreground">
          <span className="block font-semibold">{title}</span>
          {subtitle ? (
            <span className="block text-sm text-muted-foreground">
              {subtitle}
            </span>
          ) : null}
        </div>
      </Wrapper>
    </div>
  );
}

export type ContactCardProps = {
  title?: string;
  subtitle?: string;
  email?: string;
  phoneDisplay?: string;
  phoneHref?: string;
  facebookUrl?: string;
  facebookHandle?: string;
  className?: string;
};

export default function ContactCard({
  title = "Contact Alpha-News",
  subtitle = "Tips or questions? Get in touch!",
  email = "editor@alpha-news.com",
  phoneDisplay = "(555) FACTS-333",
  facebookUrl = "#",
  facebookHandle = "@alpha-news",
  className,
}: ContactCardProps) {
  return (
    <section
      className={`
    w-full lg:max-w-md overflow-hidden border border-t-3 rounded-sm border-top-primary
    bg-card text-card-foreground shadow-sm ${className ?? ""}
  `}
      aria-labelledby="contact-title"
    >
      <div aria-hidden="true" />
      <header className="px-[18px] pt-3.5 pb-2">
        <h2
          id="contact-title"
          className="text-2xl font-extrabold text-center mb-2"
        >
          {title}
        </h2>
        <p className="mt-0.5 text-[0.95rem] text-muted-foreground">
          {subtitle}
        </p>
      </header>

      <div role="list" className="grid gap-0.5 bg-border py-0.5">
        {/* Email the editor */}
        <ContactItem
          href={`#`}
          title="Email the editor"
          subtitle={email}
          ariaLabel={`Email the editor at ${email}`}
        >
          {/* mail icon */}
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
            <path d="m22 8-10 6L2 8" />
          </svg>
        </ContactItem>

        {/* Facebook */}
        <ContactItem
          href={facebookUrl}
          title="Follow us on Fakebook"
          subtitle={facebookHandle}
          ariaLabel="Follow us on Facebook"
        >
          {/* facebook icon */}
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.06 5.66 21.2 10.44 22v-7.02H7.9v-2.92h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.77l-.44 2.92h-2.33V22C18.34 21.2 22 17.06 22 12.06z" />
          </svg>
        </ContactItem>

        {/* Phone */}
        <ContactItem
          href={`#`}
          title="Call the newsroom"
          subtitle={phoneDisplay}
          ariaLabel={`Call the newsroom at ${phoneDisplay}`}
        >
          {/* phone icon */}
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.93.32 1.84.6 2.72a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.36-1.18a2 2 0 0 1 2.1-.44c.88.28 1.79.48 2.72.6A2 2 0 0 1 22 16.92z" />
          </svg>
        </ContactItem>
      </div>
    </section>
  );
}
