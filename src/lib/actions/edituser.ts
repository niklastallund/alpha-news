"use server";

import { writeFile, mkdir, unlink, stat } from "fs/promises";
import { fileTypeFromBuffer } from "file-type"; //ok, lets try.
import {
  changePwSchema,
  imageUploadSchema,
  nameMailSchema,
} from "@/validations/userpage";
import { prisma } from "../prisma";
import path from "path";
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
  console.log("uploadUserImageToCloud called");

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

    const fileType = await fileTypeFromBuffer(buffer);
    if (
      !fileType ||
      (fileType.mime !== "image/png" && fileType.mime !== "image/jpeg")
    )
      return { success: false, msg: "Invalid filetype (only jpg or png)" };

    const fileExtension = fileType.ext;

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
          console.log(`Deleted old image: ${oldFileName}`);
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
        ContentType: fileType.mime,
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

// /**
//  * Uploads an image and saves it to our cloudstorage in folder uploads with a random name, and sets the filename as image in the user.
//  * @param formData Must contain a valid image file < 1mb in format jpg or png, and userId.
//  * @returns  {success: boolean, msg: string}
//  */
// export async function uploadUserImageToCloud(
//   formData: FormData
// ): Promise<{ success: boolean; msg: string }> {
//   // CHECK parse and valid file.

//   // So first create the file locally i guess?

//   // Upload the file

//   // Get the url for the file

//   //Save the url in our db.

//   return { success: false, msg: "not done" };
// }

//Fix: cloud instead! I just keep this...
/**
 * Uploads an image and saves it to public/uploads folder with a random name, and sets the filename as image in the user.
 * @param formData Must contain a valid image file < 1mb in format jpg or png, and userId.
 * @returns {success: boolean, msg: string}
 */
export async function uploadUserImage(
  formData: FormData
): Promise<{ success: boolean; msg: string }> {
  console.log(
    "uploadUserImage called with formdata:\n" + JSON.stringify(formData)
  );

  try {
    const userId = formData.get("userId") as string;
    if (!userId) return { success: false, msg: "No user id." };

    // I think its not bad to check here too. ( also checking in client so we dont get unhandled errors due to limits in nextconfig)
    const file = formData.get("file") as File;
    if (!file || file.size === 0)
      return { success: false, msg: "No valid file." };

    if (file.size > 1 * 1024 * 1024)
      return { success: false, msg: "File is to big. (1MB)" };

    // Check filetype:
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer); // saves it as buffer.

    const fileType = await fileTypeFromBuffer(buffer);
    if (
      !fileType ||
      (fileType.mime !== "image/png" && fileType.mime !== "image/jpeg")
    )
      return { success: false, msg: "Invalid filetype (only jpg or png)" };

    const fileExtension = fileType?.ext || "png"; // So a fallback to png? Can cause trouble maybe. fix

    // parse
    const parseResult = imageUploadSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!parseResult.success)
      return { success: false, msg: parseResult.error.issues[0].message };

    // check if the user exist.
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    // So we (try) delete it now:
    if (!existingUser)
      return { success: false, msg: "No existing user with id " + userId };

    if (existingUser.image) {
      // we remove the old one.
      const oldFileName = path.basename(existingUser.image);
      const oldFilePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        oldFileName
      );

      try {
        await stat(oldFilePath);
        await unlink(oldFilePath);
      } catch (e) {
        console.log(
          "Could not delete old image file at " +
            oldFilePath +
            JSON.stringify(e)
        );
      }
    }

    // Here we get the public folder and subfolder uploads:
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const fileName = `${userId}_${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    await mkdir(uploadDir, { recursive: true }); // Create folder.

    await writeFile(filePath, buffer); //create file (writes the buffer to file).

    // Save the new file in user table image field.
    const updUserWithPic = await prisma.user.update({
      where: { id: userId },
      data: { image: `/uploads/${fileName}` },
    });

    if (updUserWithPic) {
      return { success: true, msg: "Profile pic uploaded!" };
    }
    return { success: false, msg: "Update failed." };
  } catch (e) {
    //console.log(JSON.stringify(e));
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
    } catch (e: unknown) {
      console.log(JSON.stringify(e));
      return { success: false, msg: "Failed." };
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

      // Now change name:
      const newname = await prisma.user.update({
        where: { id },
        data: { name },
      });

      if (!newname)
        return { success: false, msg: "Failed to change name in db." };

      return { success: true, msg: "Name and email saved." };
    } catch (e: unknown) {
      console.log(JSON.stringify(e));
      return { success: false, msg: "Failed." + JSON.stringify(e) };
    }
  } else {
    return { success: false, msg: "No valid inputs." };
  }
}
