import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Returns the logged-in user's JWT, or null for logged-out visitors.
export async function getServerToken(): Promise<string | null> {
  const requestHeaders = await headers();

  const jwt = await auth.api
    .getToken({ headers: requestHeaders })
    .catch(() => null);

  return jwt?.token ?? null;
}