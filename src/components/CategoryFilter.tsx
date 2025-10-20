"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Category } from "@/generated/prisma";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
}: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);

  // Create options array with "All Categories" option using "all" as value
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((category) => ({
      value: category.name,
      label: category.name,
    })),
  ];

  // URL state management to update the category filter in the URL
  // without losing other query parameters like search query
  const handleSelect = (currentValue: string) => {
    const params = new URLSearchParams(searchParams);

    if (currentValue === "all") {
      params.delete("cat");
    } else {
      params.set("cat", currentValue);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const selectedLabel = selectedCategory
    ? categoryOptions.find((option) => option.value === selectedCategory)?.label
    : "All Categories";

  return (
    <div className="w-full max-w-xs">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedLabel}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="center" sideOffset={0}>
          <Command>
            <CommandInput placeholder="Search genres..." />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categoryOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        (option.value === "all" && !selectedCategory) ||
                          selectedCategory === option.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
