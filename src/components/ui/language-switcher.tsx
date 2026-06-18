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
    <div className="inline-flex rounded-[var(--bc-radius-pill)] border border-[var(--bc-border)] bg-white/86 p-1 shadow-[var(--bc-elev-ring)]">
      <button
        type="button"
        onClick={() => select("vi")}
        className={[
          "min-h-9 cursor-pointer rounded-[var(--bc-radius-pill)] px-3 text-xs font-bold transition",
          locale === "vi" ? "bg-[var(--bc-accent)] text-white" : "text-[var(--bc-muted)] hover:text-[var(--bc-ink)]",
        ].join(" ")}
        aria-pressed={locale === "vi"}
      >
        {copy.localeSwitcher.vi}
      </button>
      <button
        type="button"
        onClick={() => select("en")}
        className={[
          "min-h-9 cursor-pointer rounded-[var(--bc-radius-pill)] px-3 text-xs font-bold transition",
          locale === "en" ? "bg-[var(--bc-accent)] text-white" : "text-[var(--bc-muted)] hover:text-[var(--bc-ink)]",
        ].join(" ")}
        aria-pressed={locale === "en"}
      >
        {copy.localeSwitcher.en}
      </button>
    </div>
  );
}
