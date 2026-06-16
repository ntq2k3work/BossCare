"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AffiliateSuggestions } from "@/components/ui/affiliate-suggestions";
import { useI18n } from "@/components/i18n-provider";
import { classifyPetCareQuestion } from "@/lib/ai-care/guard";
import type { AiCareResponse } from "@/lib/ai-care/types";
import { formatAiClassification, formatPlanLabel } from "@/lib/i18n";
import type { PlanCode } from "@/lib/entitlements/plans";
import { Badge, Button, fieldClass, cn } from "./pet-ui";

const launcherImage = "/ai-puppy-launcher.png";

type ChatMessage =
  | {
      id: string;
      role: "assistant";
      text: string;
      response?: AiCareResponse;
    }
  | {
      id: string;
      role: "user";
      text: string;
    };

export function AiCareWidget({
  planCode,
  quotaLimit,
  canChat,
}: {
  planCode: PlanCode;
  quotaLimit: number;
  canChat: boolean;
}) {
  const { copy, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      text: copy.careGuide.widget.welcome,
    },
  ]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: copy.careGuide.widget.welcome,
      },
    ]);
    setQuestion("");
  }, [copy.careGuide.widget.welcome]);

  const planLabel = useMemo(() => formatPlanLabel(locale, planCode), [locale, planCode]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;

    const scope = classifyPetCareQuestion(trimmed);
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setQuestion("");

    if (!scope.allowed) {
      setMessages((current) => [
        ...current,
        {
          id: `assistant_${Date.now()}`,
          role: "assistant",
          text: copy.careGuide.widget.outOfScope,
        },
      ]);
      return;
    }

    if (!canChat) {
      setMessages((current) => [
        ...current,
        {
          id: `assistant_${Date.now()}`,
          role: "assistant",
          text: copy.careGuide.widget.locked,
        },
      ]);
      return;
    }

    setLoading(true);
    try {
      const result = await fetch("/api/ai-care-guide", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: trimmed, locale }),
      });

      if (!result.ok) {
        setMessages((current) => [
          ...current,
          {
            id: `assistant_${Date.now()}`,
            role: "assistant",
            text: copy.careGuide.couldNotAsk,
          },
        ]);
        return;
      }

      const response = (await result.json()) as AiCareResponse;
      setMessages((current) => [
        ...current,
        {
          id: `assistant_${Date.now()}`,
          role: "assistant",
          text: response.answer,
          response,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `assistant_${Date.now()}`,
          role: "assistant",
          text: copy.careGuide.couldNotAsk,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function askPrompt(prompt: string) {
    setQuestion(prompt);
    setOpen(true);
  }

  return (
    <div className="fixed bottom-3 right-3 z-50 sm:bottom-4 sm:right-4" data-testid="pet-care-widget">
      {open ? (
        <section className="w-[min(22.5rem,calc(100vw-1.5rem))] overflow-hidden rounded-3xl border border-violet-200 bg-white shadow-[0_30px_80px_rgba(79,70,229,0.28)] sm:w-[24rem]">
          <header className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-violet-50 via-white to-amber-50 px-4 py-4">
            <img src={launcherImage} alt={copy.careGuide.widget.launcherAlt} className="h-12 w-12 rounded-2xl object-cover shadow-sm" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-black text-slate-950">{copy.careGuide.widget.title}</p>
                <Badge tone="violet">{planLabel}</Badge>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">{copy.careGuide.widget.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-600"
              aria-label={copy.careGuide.widget.close}
            >
              ×
            </button>
          </header>

          <div className="grid gap-3 px-4 py-4">
            <div className="flex items-center justify-between gap-2">
              <Badge>{copy.careGuide.sessionsPerMonth(quotaLimit)}</Badge>
              {canChat ? <Badge tone="good">{copy.careGuide.widget.ready}</Badge> : <Badge tone="warn">{copy.careGuide.widget.lockedShort}</Badge>}
            </div>

            <div className="max-h-[24rem] space-y-3 overflow-y-auto pr-1">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6",
                      message.role === "user" ? "bg-violet-600 text-white" : "border border-slate-200 bg-slate-50 text-slate-800",
                    )}
                  >
                    <p className="whitespace-pre-line">{message.text}</p>

                    {message.role === "assistant" && message.response ? (
                      <div className="mt-3 grid gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={message.response.classification === "emergency" ? "danger" : message.response.classification === "refusal" ? "warn" : "violet"}>
                            {formatAiClassification(locale, message.response.classification)}
                          </Badge>
                          <Badge>{copy.careGuide.quotaRemaining(message.response.quota.remaining, message.response.quota.limit)}</Badge>
                        </div>
                        <AffiliateSuggestions
                          title={copy.careGuide.widget.affiliateTitle}
                          suggestions={message.response.affiliateSuggestions}
                          emptyText={copy.careGuide.widget.noAffiliateSuggestions}
                          compact
                          className="pt-1"
                        />
                        {message.response.scope.allowed ? null : (
                          <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">{copy.careGuide.widget.outOfScope}</p>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
              {loading ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                    {copy.careGuide.asking}
                  </div>
                </div>
              ) : null}
              <div ref={bottomRef} />
            </div>

            <div className="grid gap-2">
              <div className="flex flex-wrap gap-2">
                {copy.careGuide.widget.quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => askPrompt(prompt)}
                    className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="grid gap-2">
                <textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  className={`${fieldClass} min-h-20 resize-none`}
                  placeholder={copy.careGuide.placeholder}
                  aria-label={copy.careGuide.question}
                  disabled={loading || !canChat}
                  data-testid="pet-care-question"
                />
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] leading-4 text-slate-400">{canChat ? copy.careGuide.widget.helper : copy.careGuide.widget.locked}</p>
                  <Button type="submit" disabled={loading || !canChat} className="min-w-28" data-testid="pet-care-submit">
                    {loading ? copy.careGuide.asking : copy.careGuide.ask}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex items-center gap-3 rounded-full border border-violet-200 bg-white/95 px-3 py-2 pr-4 shadow-[0_20px_45px_rgba(79,70,229,0.18)] backdrop-blur transition hover:-translate-y-0.5 hover:border-violet-300"
          aria-label={copy.careGuide.widget.open}
          data-testid="pet-care-launcher"
        >
          <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-violet-50">
            <img src={launcherImage} alt={copy.careGuide.widget.launcherAlt} className="h-full w-full object-cover" />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          </span>
          <span className="min-w-0 text-left">
            <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-violet-500">{copy.careGuide.widget.launcherEyebrow}</span>
            <span className="block truncate text-sm font-bold text-slate-950">{copy.careGuide.widget.launcherTitle}</span>
            <span className="block truncate text-[11px] text-slate-500">{planLabel} · {copy.careGuide.sessionsPerMonth(quotaLimit)}</span>
          </span>
        </button>
      )}
    </div>
  );
}
