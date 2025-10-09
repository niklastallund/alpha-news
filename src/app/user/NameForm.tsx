"use client";

import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { nameMailSchema } from "@/validations/userpage";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "@/lib/SessionProvider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { changeUserName } from "@/lib/actions/edituser";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Loader from "@/components/Loader";

export default function NameForm() {
  const { user } = useSession();

  const [msg, setMsg] = useState<string>("");

  const nameForm = useForm<z.infer<typeof nameMailSchema>>({
    resolver: zodResolver(nameMailSchema),
    defaultValues: {
      id: user?.id,
      name: user?.name,
      email: user?.email,
    },
  });

  if (!user) return "no user.";

  async function nameFormSub(values: z.infer<typeof nameMailSchema>) {
    // Unnessasary ? fix.
    const parseResult = nameMailSchema.safeParse(values);

    if (!parseResult.success) {
      parseResult.error.issues.map((issue) => {
        if (issue.path.toString() == "name")
          nameForm.setError("name", new Error(issue.message));
        if (issue.path.toString() == "email")
          nameForm.setError("email", new Error(issue.message));
      });

      setMsg("Invalid input");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name ?? "Anonymous");
    formData.append("email", values.email);
    formData.append("id", values.id);

    const result = await changeUserName(formData);

    if (result.success) {
      // So you will get logged out.
      window.location.reload();
    }
    setMsg(result.msg);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {" "}
          <Edit className="w-[32px] h-[32px] inline-block"></Edit> Change name
        </CardTitle>
        <CardDescription>Change your name / email.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...nameForm}>
          <form onSubmit={nameForm.handleSubmit(nameFormSub)}>
            <FormField
              control={nameForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={nameForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={nameForm.control}
              name="id"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={nameForm.formState.isSubmitting}
              className="bg-green-500 cursor-pointer p-3 w-full"
            >
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-amber-200 text-black">
        <p>{msg}</p>
        {nameForm.formState.isSubmitting && <Loader />}
      </CardFooter>
    </Card>
  );
}
