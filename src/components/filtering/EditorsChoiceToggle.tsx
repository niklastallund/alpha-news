"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

// A toggle component to filter articles based on editor's choice.
export default function EditorsChoiceToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = searchParams?.get("editors") === "1";

  const onChange = (checked: boolean) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (checked) {
      params.set("editors", "1");
    } else {
      params.delete("editors");
    }

    // Update the URL with the new query parameters, while preserving other params
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <div className="flex items-center">
      <Checkbox
        id="editors-choice"
        checked={selected}
        onCheckedChange={onChange}
        className="mr-2"
      />
      <label
        htmlFor="editors-choice"
        className="ml-1 text-sm select-none whitespace-nowrap"
      >
        {`Editor's choice`}
      </label>
    </div>
  );
}
