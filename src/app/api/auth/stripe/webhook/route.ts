// app/api/auth/stripe/webhook/route.ts
// run:
// stripe listen --forward-to localhost:3000/api/auth/stripe/webhook

import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  return auth.handler(request);
}

export const runtime = "nodejs";
