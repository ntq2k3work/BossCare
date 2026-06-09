import { cookies } from "next/headers";
import { getAuthStore } from "./store";
import { getContextFromToken } from "./service";
import { SESSION_COOKIE } from "./session";

export async function getCurrentAuthContext() {
  const cookieStore = await cookies();
  return getContextFromToken(getAuthStore(), cookieStore.get(SESSION_COOKIE)?.value);
}
