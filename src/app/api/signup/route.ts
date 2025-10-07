"use server"

// So this handles the signup, and besides just the standard better-auth logic, we also makes the first user Admin.
// The idea was to also be able to give Admin roles to other users, but that was extra. But now atleast we have one admin, that can go into the database and change role there on other users.

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SignUpFormSchema } from "@/validations/betterauthforms";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const formData = await req.json() as FormData;

    console.log("Recieved: " + JSON.stringify(formData));
    
    const result = SignUpFormSchema.safeParse(formData);

        if (!result.success) {
        return NextResponse.json(
          { error: result.error.issues[0].message },
          { status: 400 }
  );
    }

    const { name, email, password } = result.data;

    const { user } = await auth.api.signUpEmail({
      body: { name, email, password }
    });

    console.log("Got user: " + JSON.stringify(user));

    console.log("Counting users...");
    const countUsers = await prisma.user.count();
    console.log(countUsers);

    if (user) {

      if (countUsers === 1) {
        // Make the first user admin

        await prisma.user.update({
          data: { role: "admin" },
          where: { id: user.id }
        });
        console.log("Admin created.");
      }
    }

    // Return success response
    return NextResponse.json({ 
      user, 
      message: countUsers === 1 ? "Admin created!" : "User created!" 
    });


    // So, maybe we should put a standard image here in User.image? (fix)
    


  } catch (e) {
    const err = String(e);
    console.log("Signup error: " + err);
  
    return NextResponse.json(
      { error: err }, 
      { status: 500 }
    );
  }
}