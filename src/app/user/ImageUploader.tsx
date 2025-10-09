// This uploads a profile picture for the user :)
"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useSession } from "@/lib/SessionProvider";
import { uploadUserImageToCloud } from "@/lib/actions/edituser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Edit } from "lucide-react";
import { imageUploadSchema } from "@/validations/userpage";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// If we need an update function? I dont know. fix

export default function ImageUploader() {
  const { user } = useSession();

  const [msg, setMsg] = useState<string>("");

  const imageUploadForm = useForm<z.infer<typeof imageUploadSchema>>({
    resolver: zodResolver(imageUploadSchema),
    defaultValues: {
      userId: user?.id,
    },
  });

  if (!user) return "no user.";

  // So this is when pressing upload (the submit function):
  async function imageUploadSub(values: z.infer<typeof imageUploadSchema>) {
    // Create a new FormData to pass to the uploadUserImage in actions/edituser.ts (wich handles the upload).
    const formData = new FormData();

    if (!values.file) {
      setMsg("No file.");
      return;
    }

    formData.append("file", values.file);
    formData.append("userId", values.userId ?? "");

    const parseResult = imageUploadSchema.safeParse(values);

    if (!parseResult.success) {
      setMsg("Not valid.");
      return;
    }

    // Check size
    const file = formData.get("file") as File;
    if (!file || file.size === 0) {
      setMsg("File is empty.");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      setMsg("File is over 1mb.");
      return;
    }

    const result: { success: boolean; msg: string } =
      await uploadUserImageToCloud(formData);

    if (!result.success) {
      imageUploadForm.setError("file", { message: result.msg });
      setMsg(result.msg);
      return;
    }

    window.location.reload();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Edit className="w-[32px] h-[32px] inline-block"></Edit> Change
          profile image
        </CardTitle>
        <CardDescription>png or jpg, under 1mb</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...imageUploadForm}>
          <form
            onSubmit={imageUploadForm.handleSubmit(imageUploadSub)}
            className="md:flex md:gap-1 md:place-items-end p-4 flex-wrap rounded-2xl"
          >
            <FormField
              control={imageUploadForm.control}
              name="file"
              render={({ field: { onChange, ...field } }) => (
                <FormItem className="flex-1 min-w-0">
                  <FormLabel>File to upload: (png or jpg, under 1mb)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.type.includes("image")) {
                          onChange(file);
                        } else {
                          onChange(undefined);
                          e.target.value = "";
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-green-500 cursor-pointer p-3 w-full"
            >
              Upload
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-amber-200">
        <p>{msg}</p>
      </CardFooter>
    </Card>
  );
}
