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
import { Checkbox } from "@/components/ui/checkbox";

export default function NameForm({ newsLetter }: { newsLetter: boolean }) {
  const { user } = useSession();

  const [msg, setMsg] = useState<string>("");

  const nameForm = useForm<z.infer<typeof nameMailSchema>>({
    resolver: zodResolver(nameMailSchema),
    defaultValues: {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      newsletter: newsLetter ? "true" : "false",
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
    formData.append("newsletter", values.newsletter);

    const result = await changeUserName(formData);

    if (result.success) {
      // So you will get logged out.
      window.location.reload();
    }
    setMsg(result.msg);
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>
          {" "}
          <Edit className="w-[32px] h-[32px] inline-block"></Edit> Change
          details
        </CardTitle>
        <CardDescription>Change your details</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Form {...nameForm}>
          <form
            onSubmit={nameForm.handleSubmit(nameFormSub)}
            className="h-full flex flex-col "
          >
            <div className="flex-1 space-y-4">
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
                name="newsletter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Newsletter</FormLabel>
                    <FormControl>
                      <Checkbox
                        className="w-10 h-10 p-2"
                        checked={field.value === "true"}
                        {...field}
                        onCheckedChange={(checked: boolean) => {
                          field.onChange(checked ? "true" : "false");
                        }}
                      />
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
            </div>

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
      <CardFooter className="bg-amber-300 text-black">
        <p>{msg}</p>
        {nameForm.formState.isSubmitting && <Loader />}
      </CardFooter>
    </Card>
  );
}
