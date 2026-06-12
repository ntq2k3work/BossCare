"use client";

import { FormEvent, useState } from "react";
import { Badge, Button, Card, fieldClass, labelClass } from "@/components/ui/pet-ui";
import type { AiCareResponse } from "@/lib/ai-care/types";

export function CareGuideControls() {
  const [response, setResponse] = useState<AiCareResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const result = await fetch("/api/ai-care-guide", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: form.get("question") }),
    });
    setLoading(false);
    const body = await result.json();
    if (!result.ok) {
      setError(body.error?.message ?? "Could not ask AI Care Guide.");
      return;
    }
    setResponse(body);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <form onSubmit={submit} className="grid gap-4">
          <label className={labelClass}>
            Question
            <textarea name="question" className={`${fieldClass} min-h-28`} placeholder="My dog has mild diarrhea, what should I monitor?" required />
          </label>
          {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
          <Button disabled={loading} className="w-fit">
            {loading ? "Asking..." : "Ask Care Guide"}
          </Button>
        </form>
      </Card>
      {response ? (
        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={response.classification === "emergency" ? "danger" : response.classification === "refusal" ? "warn" : "violet"}>
              {response.classification}
            </Badge>
            <Badge>
              {response.quota.remaining}/{response.quota.limit} remaining
            </Badge>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-700">{response.answer}</p>
          {response.citations.length ? <p className="mt-4 text-xs text-slate-500">Sources: {response.citations.join(", ")}</p> : null}
        </Card>
      ) : null}
    </div>
  );
}
