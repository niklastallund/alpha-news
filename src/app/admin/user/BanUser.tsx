"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export const banUserSchema = z.object({
  userId: z.string(),
  banReason: z.string().min(1).max(200),
});

export type BanUserInput = z.infer<typeof banUserSchema>;

export function BanUserInput({
  userId,
  onSuccess,
}: {
  userId: string;
  onSuccess?: () => void;
}) {
  const form = useForm<BanUserInput>({
    resolver: zodResolver(banUserSchema),
    defaultValues: {
      userId: userId,
      banReason: "",
    },
  });

  async function onSubmit(formData: BanUserInput) {
    try {
      await authClient.admin.banUser({
        userId: formData.userId,
        banReason: formData.banReason,
      });
      toast.success("User banned successfully");
      onSuccess?.();
    } catch (error) {
      toast.error(`Failed to ban user: ${error}`);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Ban</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure you want to ban this user?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will prevent the user from accessing the platform.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            id="ban-user-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="banReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Ban</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      className="min-h-28 resize-y"
                      placeholder="Give a ban reason..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="submit" form="ban-user-form">
              Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
