"use client";

import * as React from "react";
import { LogIn, UserPlus, User, LogOut } from "lucide-react";
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
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message ?? "Failed to sign out");
      return;
    }
    toast.success("Successfully signed out");
    router.refresh();
  };

  // Use compact inline buttons so they visually match NavbarMenu items.

  return (
    <div className="flex items-center gap-2">
      {isLoggedIn ? (
        <>
          <Button variant="default" onClick={() => router.push("/user")}>
            <User className="h-4 w-4" />
            Profile
          </Button>

          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">
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

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">
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
        </>
      )}
    </div>
  );
}
