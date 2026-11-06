import { authClient } from "@/lib/auth-client";

export const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function authFetch(path: string, init: RequestInit = {}) {
  const { data } = await authClient.token();

  const headers = new Headers(init.headers);
  if (data?.token) headers.set("authorization", `Bearer ${data.token}`);

  return fetch(`${API}${path}`, { ...init, headers });
}