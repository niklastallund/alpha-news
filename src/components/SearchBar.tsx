"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

// A search bar component that updates the URL search parameters on input change.
// It is mainly used on the ArticlePage to filter articles based on the search query.
export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    router.replace(`?${params.toString()}`);
  };

  return (
    <Input
      type="text"
      placeholder="Search for articles..."
      value={query}
      onChange={handleChange}
      className="w-full"
    />
  );
}
