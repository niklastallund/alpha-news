"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AccountMenu from "./AccountMenu";
import { ModeToggle } from "./theme-toggle";
import { Separator } from "./ui/separator";
import { Category } from "@/generated/prisma";

export default function MobileNav({
  isLoggedIn,
  isAdminOrEmployee,
  categories = [],
}: {
  isLoggedIn: boolean;
  isAdminOrEmployee: boolean;
  categories: Category[];
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0">
        <SheetHeader className="p-4">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="px-2 pb-4 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            <SheetClose asChild>
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground"
              >
                Home
              </Link>
            </SheetClose>

            <Separator />

            <Accordion type="single" collapsible className="px-1">
              <AccordionItem value="news">
                <AccordionTrigger className="px-2 text-sm">
                  News
                </AccordionTrigger>
                <AccordionContent className="pl-3 pb-2">
                  <ul className="flex flex-col gap-1">
                    <li>
                      <SheetClose asChild>
                        <Link
                          href={`/article`}
                          className="block px-2 py-1.5 rounded-md text-sm hover:bg-accent hover:text-accent-foreground"
                        >
                          All
                        </Link>
                      </SheetClose>
                    </li>
                    {categories.map((c) => (
                      <li key={c.id}>
                        <SheetClose asChild>
                          <Link
                            href={`/article?cat=${encodeURIComponent(c.name)}`}
                            className="block px-2 py-1.5 rounded-md text-sm hover:bg-accent hover:text-accent-foreground"
                          >
                            {c.name}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="editors">
                <AccordionTrigger className="px-2 text-sm">
                  {`Editor's Choice`}
                </AccordionTrigger>
                <AccordionContent className="pl-3 pb-2">
                  <ul className="flex flex-col gap-1">
                    <li>
                      <SheetClose asChild>
                        <Link
                          href={`/article?editors=1`}
                          className="block px-2 py-1.5 rounded-md text-sm hover:bg-accent hover:text-accent-foreground"
                        >
                          All
                        </Link>
                      </SheetClose>
                    </li>
                    {categories.map((c) => (
                      <li key={`ed-${c.id}`}>
                        <SheetClose asChild>
                          <Link
                            href={`/article?editors=1&cat=${encodeURIComponent(
                              c.name
                            )}`}
                            className="block px-2 py-1.5 rounded-md text-sm hover:bg-accent hover:text-accent-foreground"
                          >
                            {c.name}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {isAdminOrEmployee && (
                <AccordionItem value="admin">
                  <AccordionTrigger className="px-2 text-sm">
                    Employee
                  </AccordionTrigger>
                  <AccordionContent className="pl-3 pb-2">
                    <ul className="flex flex-col gap-1">
                      <li>
                        <SheetClose asChild>
                          <Link
                            href="#"
                            className="block px-2 py-1.5 rounded-md text-sm hover:bg-accent hover:text-accent-foreground"
                          >
                            Dashboard
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link
                            href="#"
                            className="block px-2 py-1.5 rounded-md text-sm hover:bg-accent hover:text-accent-foreground"
                          >
                            Statistics
                          </Link>
                        </SheetClose>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </nav>

          <Separator className="mb-3" />

          <div className="px-2 py-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <AccountMenu isLoggedIn={isLoggedIn} />
              </div>
              <div className="flex items-center">
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
