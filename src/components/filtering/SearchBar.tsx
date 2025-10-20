"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import useDebounce from "@/lib/hooks/useDebounce";

// 500ms debounce for the search query seems reasonable?
const DEBOUNCE_DELAY = 500;

// A search bar component that updates the URL search parameters on input change.
// It is mainly used on the ArticlePage to filter articles based on the search query.
export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);

  // Update the URL only when debouncedQuery changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    router.replace(`?${params.toString()}`);
  }, [debouncedQuery, searchParams, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
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
