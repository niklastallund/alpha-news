import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { admin } from "better-auth/plugins";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";
import { nextCookies } from "better-auth/next-js";

// From: https://www.better-auth.com/docs/plugins/stripe
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  plugins: [
    admin(),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!, // (The ! in the end promise ts that it is a string.)
      createCustomerOnSignUp: true, // Jag sätter detta till false, för att inte bli omdirigerad vid sign-up.
      subscription: {
        enabled: true,
        plans: [
          {
            name: "basic", // the name of the plan, it'll be automatically lower cased when stored in the database
            priceId: "price_1SFxfR1PAHMjKtKVWu5yWfT7", // the price ID from stripe
            // annualDiscountPriceId: "price_1234567890", // (optional) the price ID for annual billing with a discount. Maybe implement this
          },
          {
            name: "pro",
            priceId: "price_1SFxfz1PAHMjKtKVqTmeyj58",
          },
        ],

        onSubscriptionCancel: async (e) => {
          console.log("SUB DELETED!" + JSON.stringify(e)); // I keep this just to prepare for it.
        },
        onSubscriptionUpdate: async (e) => {
          console.log("SUB UPDATED!" + JSON.stringify(e));
          const subData = e.event.data.object as Stripe.Subscription;

          const cancelled =
            subData.cancel_at_period_end === true || subData.cancel_at !== null;

          if (cancelled) {
            const getId = await prisma.subscription.findFirst({
              where: { stripeSubscriptionId: subData.id },
              select: { id: true },
            });
            if (getId) {
              const upd = await prisma.subscription.update({
                where: { id: getId.id },
                data: { cancelAtPeriodEnd: true },
              });
            }
          } else {
            const getId = await prisma.subscription.findFirst({
              where: { stripeSubscriptionId: subData.id },
              select: { id: true },
            });
            if (getId) {
              const upd = await prisma.subscription.update({
                where: { id: getId.id },
                data: { cancelAtPeriodEnd: false },
              });
            }
          }
        },
      },
    }),
    nextCookies(), // För att automatiskt skapa cookies som jag förstod det. https://www.better-auth.com/docs/integrations/next#server-action-cookies
  ], // This includes role into session:
  user: {
    changeEmail: { enabled: true },
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
    },
  },
});
