"use client"

// Yes so this is just based on a lecture we had about better-auth, so we did not have time to make this (or anything really) look as good as we wanted to. But it works!


// i focus on the session stuff later. Working on import!!

import SignInForm from "@/components/forms/SignInForm"

export default function SignInPage() {




  // So here we create our sign-in page with form later
  return (
    <div>
      <SignInForm />
    </div>
  );
}


// "use client"

// // So this is mainly from our lecture when we did that blogstuff.

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";


// import z from "zod";

// import { SignInFormSchema } from "@/lib/validation-schemas";

// type FormValues = z.infer<typeof SignInFormSchema>;


// export default function SignInPage() {

//   const form = useForm<FormValues>({
//     resolver: zodResolver(SignInFormSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     }
//   });


//   // So here we create our sign-in page with form later
//   return null;
// }

