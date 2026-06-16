"use client";

import { useI18n } from "@/components/i18n-provider";
import { normalizeLocale, type Locale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, copy, setLocale } = useI18n();

  function select(nextLocale: Locale) {
    const normalized = normalizeLocale(nextLocale);
    if (normalized === locale) return;
    setLocale(normalized);
  }

  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={() => select("vi")}
        className={[
          "min-h-9 rounded-full px-3 text-xs font-bold transition",
          locale === "vi" ? "bg-violet-600 text-white" : "text-slate-500 hover:text-slate-900",
        ].join(" ")}
        aria-pressed={locale === "vi"}
      >
        {copy.localeSwitcher.vi}
      </button>
      <button
        type="button"
        onClick={() => select("en")}
        className={[
          "min-h-9 rounded-full px-3 text-xs font-bold transition",
          locale === "en" ? "bg-violet-600 text-white" : "text-slate-500 hover:text-slate-900",
        ].join(" ")}
        aria-pressed={locale === "en"}
      >
        {copy.localeSwitcher.en}
      </button>
    </div>
  );
}
