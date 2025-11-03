"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

const FormSchema = z.object({
  role: z.enum(UserRole),
});

export default function SetUserRole({
  userId,
  userRole,
  onSuccess,
}: {
  userId: string;
  userRole: UserRole;
  onSuccess?: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: userRole,
    },
  });

  const roles = Object.values(UserRole) as UserRole[];

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      try {
        await authClient.admin.setRole({
          userId,
          role: data.role,
        });
        toast.success("User role updated successfully");
        onSuccess?.();
      } catch (err) {
        console.error("Error setting user role:", err);
        const message =
          err instanceof Error ? err.message : "Failed to update user role.";
        toast.error(message);
      }
    });
  }

  const roleLabel = (r: UserRole) => r.charAt(0).toUpperCase() + r.slice(1);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Change role</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Set user role</AlertDialogTitle>
          <AlertDialogDescription>
            Select a role for this user and save.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="py-4 space-y-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block">Role</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={(v) => field.onChange(v as UserRole)}
                        aria-label="User role"
                      >
                        <div className="flex flex-col gap-2">
                          {roles.map((r) => (
                            <div
                              key={r}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={r}
                                id={`role-${r}`}
                                disabled={isPending}
                              />
                              <Label htmlFor={`role-${r}`}>
                                {roleLabel(r)}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
