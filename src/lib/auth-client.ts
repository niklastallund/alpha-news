import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";
import { ac, admin, employee, user } from "./permissons";

// So here i have added the admin plugin, and also stripe (from https://www.better-auth.com/docs/plugins/stripe)
export const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        user,
        employee,
      },
    }),
    stripeClient({
      subscription: true, //if you want to enable subscription management. Have not read about this yet, but i guess it should be enabled. // Tobbe.
    }),
  ],
});

export const { signIn, signUp, useSession } = createAuthClient();
