"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { SignInFormSchema } from "@/validations/betterauthforms";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { useForm } from "react-hook-form";
import z from "zod";
import { useSession } from "@/lib/SessionProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const formSchema = SignInFormSchema;
type FormValues = z.infer<typeof formSchema>;

export default function SignInForm() {
  const { session } = useSession();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   *
   * @param values Values must contain email and password, based on SignInFormSchema.
   */
  async function onSubmit(values: FormValues) {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });
    if (error) {
      alert(error.message);
    } else {
      // Signed in! Reload to make sure the provider gets the session, and then be redirected.
      window.location.reload();
    }
  }

  // So after the reload (or if getting to this page with a session), goto user page!
  useEffect(() => {
    if (session) router.push("/user");
  }, [session, router]);

  if (session) return null;

  return (
    <Card className="max-w-sm mx-auto mt-10">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your details below to create an Account
        </CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              Sign In
            </Button>
          </form>
        </Form>

        {form.formState.isSubmitting && (
          <div className="w-full flex justify-center p-5 mx-auto">
            <div className="w-20 h-20 rounded-full animate-spin border-8 border-blue-600 border-t-blue-200 text-2xl flex text-center items-center">
              <div className="w-10 h-10 border-6 border-red-600 border-b-red-200 rounded-full mx-auto my-auto"></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
