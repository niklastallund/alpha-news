import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { admin } from "better-auth/plugins";
import { stripe } from "@better-auth/stripe"
import Stripe from "stripe"


// From: https://www.better-auth.com/docs/plugins/stripe
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
})


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6
  },
  plugins: [
    admin(),
     stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!, // (The ! in the end promise ts that it is a string.)
            createCustomerOnSignUp: true,
        })
  ], // This includes role into session:
    user: {
       additionalFields: {
          role: {
              type: "string",
              input: false
            } 
        }
    }
});
