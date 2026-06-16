"use client";

import { FormEvent, useState } from "react";
import { Badge, Button, Card, fieldClass, labelClass } from "@/components/ui/pet-ui";
import { AffiliateSuggestions } from "@/components/ui/affiliate-suggestions";
import type { AiCareResponse } from "@/lib/ai-care/types";
import { classifyPetCareQuestion } from "@/lib/ai-care/guard";
import { formatAiClassification } from "@/lib/i18n";
import { useI18n } from "@/components/i18n-provider";

export function CareGuideControls() {
  const { copy, locale } = useI18n();
  const [response, setResponse] = useState<AiCareResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResponse(null);
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const question = String(form.get("question") ?? "").trim();
    const scope = classifyPetCareQuestion(question);
    if (!scope.allowed) {
      setLoading(false);
      setError(copy.careGuide.widget.outOfScope);
      return;
    }

    try {
      const result = await fetch("/api/ai-care-guide", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, locale }),
      });
      if (!result.ok) {
        setError(copy.careGuide.couldNotAsk);
        return;
      }
      const body = await result.json();
      setResponse(body);
    } catch {
      setError(copy.careGuide.couldNotAsk);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4">
      <Card>
        <form onSubmit={submit} className="grid gap-4">
          <label className={labelClass}>
            {copy.careGuide.question}
            <textarea
              name="question"
              className={`${fieldClass} min-h-28`}
              placeholder={copy.careGuide.placeholder}
              required
              data-testid="care-guide-question"
            />
          </label>
          {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
          <Button disabled={loading} className="w-fit" data-testid="care-guide-submit">
            {loading ? copy.careGuide.asking : copy.careGuide.ask}
          </Button>
        </form>
      </Card>
      {response ? (
        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={response.classification === "emergency" ? "danger" : response.classification === "refusal" ? "warn" : "violet"}>
              {formatAiClassification(locale, response.classification)}
            </Badge>
            <Badge>{copy.careGuide.quotaRemaining(response.quota.remaining, response.quota.limit)}</Badge>
          </div>
          <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-700">{response.answer}</p>
          <AffiliateSuggestions
            title={copy.careGuide.affiliateTitle}
            suggestions={response.affiliateSuggestions}
            emptyText={copy.careGuide.noAffiliateSuggestions}
            ctaLabel={copy.careGuide.openLink}
            className="mt-4"
          />
          {response.scope.allowed ? null : <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">{copy.careGuide.widget.outOfScope}</p>}
          {response.citations.length ? <p className="mt-4 text-xs text-slate-500">{copy.careGuide.sources} {response.citations.join(", ")}</p> : null}
        </Card>
      ) : null}
    </div>
  );
}
