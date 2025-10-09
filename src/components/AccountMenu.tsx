"use client";
import * as React from "react";
import Link from "next/link";
import { LogIn, UserPlus, User, LogOut } from "lucide-react";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import SignUpForm from "./forms/SignUpForm";
import SignInForm from "./forms/SignInForm";

export default function AccountMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Successfully signed out");
          router.refresh();
        },
      },
    });
  };

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Account</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-15">
          {isLoggedIn ? (
            <li>
              <NavigationMenuLink asChild>
                <Button
                  variant="ghost"
                  className="flex-row items-center gap-2 w-full"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                {/* sign out can call a handler or link to an API route */}
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="flex-row items-center gap-2 w-full"
                >
                  <LogOut />
                  Sign Out
                </Button>
              </NavigationMenuLink>
            </li>
          ) : (
            <li>
              <NavigationMenuLink asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex-row items-center gap-2 w-full"
                    >
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="sr-only">Sign In</DialogTitle>
                    </DialogHeader>
                    <SignInForm />
                  </DialogContent>
                </Dialog>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex-row items-center gap-2 w-full"
                    >
                      <UserPlus className="h-4 w-4" />
                      Sign Up
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="sr-only">Sign Up</DialogTitle>
                    </DialogHeader>
                    <SignUpForm />
                  </DialogContent>
                </Dialog>
              </NavigationMenuLink>
            </li>
          )}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
