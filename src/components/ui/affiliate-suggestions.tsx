import type { AffiliateSuggestion } from "@/lib/affiliate-links/types";
import { ButtonLink, cn } from "./pet-ui";

export function AffiliateSuggestions({
  title,
  suggestions,
  emptyText,
  ctaLabel,
  compact = false,
  className,
}: {
  title: string;
  suggestions: AffiliateSuggestion[];
  emptyText?: string;
  ctaLabel?: string;
  compact?: boolean;
  className?: string;
}) {
  if (!suggestions.length) {
    if (!emptyText) return null;
    return <p className={cn("text-sm text-slate-500", className)}>{emptyText}</p>;
  }

  return (
    <div className={cn("grid gap-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <h3 className={compact ? "text-sm font-semibold text-slate-800" : "text-base font-bold text-slate-900"}>{title}</h3>
      </div>
      <div className="grid gap-3">
        {suggestions.map((suggestion) => (
          <a
            key={suggestion.slug}
            href={suggestion.affiliateUrl}
            target="_blank"
            rel="noreferrer"
            className="group rounded-lg border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{suggestion.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{suggestion.description}</p>
              </div>
              <span className="shrink-0 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 transition group-hover:bg-violet-100">
                ↗
              </span>
            </div>
          </a>
        ))}
      </div>
      {compact ? null : (
        <ButtonLink href={suggestions[0].affiliateUrl} target="_blank" rel="noreferrer" variant="secondary" className="w-fit border-violet-200 text-violet-700">
          {ctaLabel ?? "Open link"}
        </ButtonLink>
      )}
    </div>
  );
}
