"use server";

import {
  changePwSchema,
  imageUploadSchema,
  nameMailSchema,
} from "@/validations/userpage";
import { prisma } from "../prisma";
import { auth } from "../auth";
import { headers } from "next/headers";

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

/**
 * Uploads an image and saves it to our cloud storage in folder uploads with a random name, and sets the filename as image in the user.
 * @param formData Must contain a valid image file < 1mb in format jpg or png, and userId.
 * @returns {success: boolean, msg: string}
 */
export async function uploadUserImageToCloud(
  formData: FormData
): Promise<{ success: boolean; msg: string }> {
  // console.log("uploadUserImageToCloud called");

  try {
    const userId = formData.get("userId") as string;
    if (!userId) return { success: false, msg: "No user id." };

    // Check file
    const file = formData.get("file") as File;
    if (!file || file.size === 0)
      return { success: false, msg: "No valid file." };

    if (file.size > 1 * 1024 * 1024)
      return { success: false, msg: "File is too big. (1MB)" };

    // Check filetype
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // file.type: (property) Blob.type: string
    // The type read-only property of the Blob interface returns the MIME type of the file.

    if (!file || (file.type !== "image/png" && file.type !== "image/jpeg"))
      return { success: false, msg: "Invalid filetype (only jpg or png)" };

    const fileExtension = file.type === "image/png" ? ".png" : ".jpg";

    // Parse validation
    const parseResult = imageUploadSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!parseResult.success)
      return { success: false, msg: parseResult.error.issues[0].message };

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    if (!existingUser)
      return { success: false, msg: "No existing user with id " + userId };

    // Delete old image from R2 if exists
    if (existingUser.image) {
      // Extract filename from URL (e.g., from https://pub-xxx.r2.dev/userid_timestamp.jpg)
      const oldFileName = existingUser.image.split("/").pop();
      if (oldFileName) {
        try {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME!,
              Key: oldFileName,
            })
          );
          // console.log(`Deleted old image: ${oldFileName}`);
        } catch (e) {
          console.log("Could not delete old image:", e);
          // Continue anyway ✌️ =)
        }
      }
    }

    // Upload new image to R2 =)
    const fileName = `${userId}_${Date.now()}.${fileExtension}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // Construct public URL
    const imageUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

    // Update user with new image URL
    const updUserWithPic = await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
    });

    if (updUserWithPic) {
      return { success: true, msg: "Profile pic uploaded!" };
    }
    return { success: false, msg: "Update failed." };
  } catch (e) {
    console.error("Upload error:", e);
    return { success: false, msg: "Server error. \n" + e };
  }
}

/**
 *
 * @param formData Needs to have FormData with newPassword and currentPassword.
 * @returns  {success: boolean, msg: string}
 */
export async function changeUserPw(
  formData: FormData
): Promise<{ success: boolean; msg: string }> {
  // First, safeParse the data.
  const pwdata = Object.fromEntries(formData.entries());
  const parseResult = changePwSchema.safeParse(pwdata);

  if (parseResult.success) {
    try {
      const data = await auth.api.changePassword({
        body: {
          newPassword: (pwdata.newpw as string) ?? "",
          currentPassword: (pwdata.currpw as string) ?? "",
          revokeOtherSessions: true,
        },
        // This endpoint requires session cookies.
        headers: await headers(),
      });

      if (!data) return { success: false, msg: "Failed" };
      return { success: true, msg: "Password changed." };
    } catch (e) {
      return { success: false, msg: "Failed." + JSON.stringify(e) };
    }
  } else {
    return { success: false, msg: "Not valid pw" };
  }
}

/**
 * This function first checks if id, name and email is valid and that id exist, then calls the better-auth api to change the email and name.
 * @param formData Need to have id, name and email.
 * @returns {success: boolean, msg: string}
 */
export async function changeUserName(
  formData: FormData
): Promise<{ success: boolean; msg: string }> {
  //Safe parse the formdata
  const userdata = Object.fromEntries(formData.entries());
  const parseResult = nameMailSchema.safeParse(userdata);

  // Check name.
  const name = userdata.name as string;
  if (!name) return { success: false, msg: "No name" };

  // Check email.
  const email = userdata.email as string;
  if (!name) return { success: false, msg: "No email" };

  // Check id
  const id = userdata.id as string;
  if (!id) return { success: false, msg: "No id" };

  // Check newsletter
  const newsletter = userdata.newsletter as string;
  if (!newsletter) return { success: false, msg: "No newsletter" };

  // Get the user to compare. This is maybe uneccassary. fix
  const checkUsr = await prisma.user.findUnique({ where: { id } });
  if (!checkUsr || checkUsr.id !== id)
    return { success: false, msg: "No id match" };

  if (parseResult.success) {
    try {
      // Only change if email was diff:
      if (checkUsr.email !== email) {
        const newmail = await auth.api.changeEmail({
          body: {
            newEmail: (userdata.email as string) ?? "",
          },
          // This endpoint requires session cookies.
          headers: await headers(),
        });

        if (!newmail) return { success: false, msg: "Failed to change email" };
      }

      // Change newsletter:
      const nl: boolean = newsletter === "true";
      console.log("Setting to " + nl);
      const updNewsletter = await prisma.user.update({
        where: { id },
        data: { newsLetter: nl },
      });

      console.log(updNewsletter);

      // Now change name:
      const newname = await prisma.user.update({
        where: { id },
        data: { name },
      });

      if (!newname)
        return { success: false, msg: "Failed to change name in db." };

      return { success: true, msg: "Name and email saved." };
    } catch (e: unknown) {
      return { success: false, msg: "Failed." + JSON.stringify(e) };
    }
  } else {
    return { success: false, msg: "No valid inputs." };
  }
}