"use client";

import { Edit } from "lucide-react";
import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePwSchema } from "@/validations/userpage";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { changeUserPw } from "@/lib/actions/edituser";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/SessionProvider";

export default function PasswordForm() {
  const [msg, setMsg] = useState<string>("");

  const formEditPw = useForm<z.infer<typeof changePwSchema>>({
    resolver: zodResolver(changePwSchema),
    defaultValues: {
      currpw: "",
      newpw: "",
      confirmPassword: "",
    },
  });

  const { user } = useSession();
  if (!user) return "no user.";

  // fix: go through all my forms, and decide how every form should work. This is workin i think.
  async function editPwSub(values: z.infer<typeof changePwSchema>) {
    const parseResult = changePwSchema.safeParse(values);

    if (!parseResult.success) {
      parseResult.error.issues.map((issue) => {
        if (issue.path.toString() == "newpw")
          formEditPw.setError("newpw", new Error(issue.message));
        if (issue.path.toString() == "currpw")
          formEditPw.setError("currpw", new Error(issue.message));
        if (issue.path.toString() == "confirmPassword")
          formEditPw.setError("confirmPassword", new Error(issue.message));
        setMsg((prev) => (prev ? prev + ("," + issue.message) : issue.message));
      });

      return;
    }

    const formData = new FormData();
    formData.append("newpw", values.newpw);
    formData.append("confirmPassword", values.confirmPassword);
    formData.append("currpw", values.currpw);

    // add in edituser
    const result = await changeUserPw(formData);

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
          <Edit className="w-[32px] h-[32px] inline-block"></Edit> Change
          password
        </CardTitle>
        <CardDescription>min 6 letters</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...formEditPw}>
          <form onSubmit={formEditPw.handleSubmit(editPwSub)}>
            <FormField
              control={formEditPw.control}
              name="currpw"
              render={({ field }) => (
                <FormItem className="flex-1 min-w-0">
                  <FormLabel>Current password:</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formEditPw.control}
              name="newpw"
              render={({ field }) => (
                <FormItem className="flex-1 min-w-0">
                  <FormLabel>New password:</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formEditPw.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="flex-1 min-w-0">
                  <FormLabel>Confirm:</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={formEditPw.formState.isSubmitting}
              className="bg-green-500 cursor-pointer p-3 w-full"
            >
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-amber-200">
        <p>{msg}</p>
        {formEditPw.formState.isSubmitting && (
          <div className="w-full flex justify-center p-5 mx-auto">
            <div className="w-20 h-20 rounded-full animate-spin border-8 border-blue-600 border-t-blue-200 text-2xl flex text-center items-center">
              <div className="w-10 h-10 border-6 border-red-600 border-b-red-200 rounded-full mx-auto my-auto"></div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
