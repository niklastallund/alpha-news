import Image from "next/image";
import NavbarMenu from "./NavbarMenu";
import { getRole, getSessionData } from "@/lib/actions/sessiondata";
import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
import AccountMenu from "./AccountMenu";
import MobileNav from "./MobileNav";
import { prisma } from "@/lib/prisma";
import { Category } from "@/generated/prisma/wasm";

export default async function Navbar() {
  // Session checks for the navbar menu
  const session = await getSessionData();
  const isLoggedIn = !!session;
  const isAdminOrEmployee = (await getRole()) === "admin" || (await getRole()) === "employee";

  const categories: Category[] = await prisma.category.findMany({
    where: { onNavbar: true },
    orderBy: { name: "asc" },
  });

  return (
    <nav className="sticky top-0 mb-2 z-50 bg-background/100 border-b-3 border-primary">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-2">
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse flex-shrink-0"
          >
            <Image
              src="/alphalogo.svg"
              alt="Logo"
              width={240}
              height={240}
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex-1 md:flex items-center justify-center min-w-0">
            <NavbarMenu isAdminOrEmployee={isAdminOrEmployee} categories={categories} />
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <AccountMenu isLoggedIn={isLoggedIn} />
            <ModeToggle />
          </div>

          {/* Mobile hamburger (Sheet) */}
          <div className="md:hidden">
            <MobileNav isLoggedIn={isLoggedIn} isAdminOrEmployee={isAdminOrEmployee} />
          </div>
        </div>
      </div>
    </nav>
  );
}
