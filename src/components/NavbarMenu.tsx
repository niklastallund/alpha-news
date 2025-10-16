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
  isAdmin,
  categories,
}: {
  isAdmin: boolean;
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
              {categories.map((category) => (
                <ListItem
                  key={category.id}
                  title={category.name}
                  href={`/article`}
                ></ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{`Editor's Choice`}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[100px] gap-2 md:w-[200px] md:grid-cols-2 lg:w-[300px]">
              {categories.map((category) => (
                <ListItem
                  key={category.id}
                  title={category.name}
                  href={`/article`}
                ></ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Admin Menu, only visible if user is admin */}
        {isAdmin && (
          <NavigationMenuItem>
            <NavigationMenuTrigger>Admin</NavigationMenuTrigger>
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
