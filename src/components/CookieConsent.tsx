"use client";

import * as React from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

export function CookieConsent() {
  // isMounted is used to avoid SSR mismatch (hydration issues)
  const [isMounted, setIsMounted] = useState(false);
  const [consent, setConsent] = useState<boolean | null>(null);

  // Reading stored consent on client to avoid potential SSR mismatch
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem("cookie_consent");
      if (stored === "true") {
        setConsent(true);
      } else if (stored === "false") {
        setConsent(false);
      }
    } catch {
      console.error("Could not access localStorage");
    }
  }, []);

  // Persist consent in localStorage and cookies
  function persistConsent(value: boolean) {
    try {
      localStorage.setItem("cookie_consent", value ? "true" : "false");
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `cookie_consent=${
        value ? "true" : "false"
      }; path=/; expires=${expires.toUTCString()}; SameSite=Lax;`;
    } catch {
      console.error("Could not access localStorage");
    }

    setConsent(value);
  }

  // Don't render server-side or while still deciding
  if (!isMounted || consent !== null) return null;

  const description =
    "We use cookies to enhance your experience. For more information on how we use cookies, please see our cookie policy.";

  return (
    <Card
      className="max-w-md m-3 shadow-lg fixed bottom-4 left-4 z-50"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 h-0 px-4">
        <CardTitle className="text-base">We use cookies</CardTitle>
        <Cookie className="h-4 w-4" />
      </CardHeader>
      <CardContent className="pt-0 pb-2 px-4">
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardContent>
      <CardFooter className="flex gap-2 h-0 py-2 px-4">
        <Button
          onClick={() => persistConsent(false)}
          variant="secondary"
          size="sm"
          className="flex-1 rounded-full"
        >
          Decline
        </Button>
        <Button
          onClick={() => persistConsent(true)}
          size="sm"
          className="flex-1 rounded-full"
        >
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
}
