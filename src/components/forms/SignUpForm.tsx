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

import { SignUpFormSchema } from "@/validations/betterauthforms";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useSession } from "@/lib/SessionProvider";
import { useRouter } from "next/navigation";


const formSchema = SignUpFormSchema;

type FormValues = z.infer<typeof formSchema>;

export default function SignUpForm() {


  const { session } = useSession();
  const router = useRouter();

  const [signUpError, setSignUpError] = useState<{msg: string}>({msg: ""});

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: FormValues) {

    try {

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword
        })
      });

      const result = await response.json();

      if (response.ok) {

        // Sign in and go to user page!
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });
      if (error) {
        alert(error.message);
      } else {
        // Signed in
        // i use this because the sessionprovider wont be updated yet. so this reloads everything and then redirect. 
        window.location.reload();

      }
      
      } else {
        
        setSignUpError({msg: result.error ?? "Signup failed."});

      }

    } catch (error) {

      setSignUpError({msg: String(error)});
      //console.log("Network error:", error);

    }
      
  }

  useEffect( () => {

    if (session) router.push("/user");

  },[session, router]);

  if (session) return null;
  
  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          Enter your details below to create an Account
        </CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ConfirmPassword</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-red-600">
              {signUpError.msg && signUpError.msg}
            </div>
            <Button className="w-full" type="submit">
              Sign Up
            </Button>
          </form>
        </Form>

              {form.formState.isSubmitting && <div className="w-full flex justify-center p-5 mx-auto"><div className="w-20 h-20 rounded-full animate-spin border-8 border-blue-600 border-t-blue-200 text-2xl flex text-center items-center"><div className="w-10 h-10 border-6 border-red-600 border-b-red-200 rounded-full mx-auto my-auto"></div></div></div>}

      </CardContent>
    </Card>
  );
}
