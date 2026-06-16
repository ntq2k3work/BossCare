"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getCopy, LOCALE_COOKIE, type Copy, type Locale, normalizeLocale } from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  copy: Copy;
  setLocale: (nextLocale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const router = useRouter();
  const setLocale = useCallback(
    (nextLocale: Locale) => {
      const normalized = normalizeLocale(nextLocale);
      document.cookie = `${LOCALE_COOKIE}=${normalized}; path=/; max-age=31536000; samesite=lax`;
      router.refresh();
    },
    [router],
  );

  return (
    <I18nContext.Provider value={{ locale: initialLocale, copy: getCopy(initialLocale), setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider.");
  }
  return context;
}

