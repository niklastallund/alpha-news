"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Category } from "@/generated/prisma";

export default function NavbarMenu({
  isAdminOrEmployee,
  categories,
}: {
  isAdminOrEmployee: boolean;
  categories: Category[];
}) {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>News</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[100px] gap-2 md:w-[200px] md:grid-cols-2 lg:w-[300px]">
              <ListItem key="all" title="All" href={`/article`} />
              {categories.map((category) => (
                <ListItem
                  key={category.id}
                  title={category.name}
                  href={`/article?cat=${encodeURIComponent(category.name)}`}
                ></ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{`Editor's Choice`}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[100px] gap-2 md:w-[200px] md:grid-cols-2 lg:w-[300px]">
              {/* Link to all editor's choice articles */}
              <ListItem
                key="editors-all"
                title="All"
                href={`/article?editors=1`}
              />

              {/* Per-category editor's choice links */}
              {categories.map((category) => (
                <ListItem
                  key={category.id}
                  title={category.name}
                  href={`/article?editors=1&cat=${encodeURIComponent(
                    category.name
                  )}`}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Employee Menu, only visible if user is admin/employee */}
        {isAdminOrEmployee && (
          <NavigationMenuItem>
            <NavigationMenuTrigger>Employee</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="/admin">Dashboard</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="#">Statistics</Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// Creates a list item for a navigation menu with styling and a link
function ListItem({ title, href }: { title: string; href: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={href} className="block">
          <div className="text-sm leading-none font-medium">{title}</div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
