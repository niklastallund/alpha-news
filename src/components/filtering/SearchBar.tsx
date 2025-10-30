"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import useDebounce from "@/lib/hooks/useDebounce";

// 500ms debounce for the search query seems reasonable?
const DEBOUNCE_DELAY = 500;

// A search bar component that updates the URL search parameters on input change.
export default function SearchBar({ placeholder }: { placeholder?: string }) {
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
      placeholder={placeholder || "Search..."}
      value={query}
      onChange={handleChange}
      className="w-full"
    />
  );
}
