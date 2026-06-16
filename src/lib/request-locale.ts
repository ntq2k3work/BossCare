import { cache } from "react";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, normalizeLocale, type Locale } from "./i18n";

export const getRequestLocale = cache(async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);
});
