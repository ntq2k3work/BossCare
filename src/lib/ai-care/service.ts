import { z, ZodError } from "zod";
import type { AuthContext } from "@/lib/auth/types";
import { getAffiliateSuggestions } from "@/lib/affiliate-links/service";
import { AiCareError } from "./errors";
import { buildCareAnswer, selectKnowledgeChunks } from "./catalog";
import { classifyPetCareQuestion } from "./guard";
import { rewriteCareAnswerWithGemini } from "./gemini";
import type { AiCareResponse, AiCareStore } from "./types";

const askSchema = z.object({
  question: z.string().trim().min(3).max(1000),
  locale: z.enum(["vi", "en"]).optional(),
});

const emergencyPattern = /\b(cannot breathe|choking|seizure|unconscious|collapse|poison|bleeding|emergency|khong tho|co giat|ngo doc|chay mau)\b/i;
const unsafeMedicationPattern = /\b(dose|dosage|paracetamol|ibuprofen|antibiotic|thuoc nguoi|lieu luong)\b/i;

export async function askAiCareGuide(context: AuthContext, store: AiCareStore, input: unknown, now = new Date()): Promise<AiCareResponse> {
  if (!context.activeHousehold) throw new AiCareError("no_household", "No active household is available.", 403);

  let parsedInput: z.infer<typeof askSchema>;
  try {
    parsedInput = askSchema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) throw new AiCareError("invalid_question", "Ask a clear pet care question.", 400);
    throw error;
  }

  const { question, locale = "vi" } = parsedInput;

  const scope = classifyPetCareQuestion(question);
  const monthKey = now.toISOString().slice(0, 7);
  const used = await store.countSessions(context.activeHousehold.id, monthKey);
  const limit = context.entitlements.aiSessionsPerMonth;

  if (!scope.allowed) {
    return quotaResponse(
      buildCareAnswer({
        locale,
        mode: "out_of_scope",
        citations: [],
        topic: null,
      }),
      "refusal",
      [],
      used,
      limit,
      false,
      scope,
      [],
    );
  }

  if (emergencyPattern.test(question)) {
    return quotaResponse(
      buildCareAnswer({
        locale,
        mode: "emergency",
        citations: [],
        topic: scope.topic,
      }),
      "emergency",
      ["emergency-safety"],
      used,
      limit,
      false,
      scope,
      [],
    );
  }

  if (used >= limit) {
    throw new AiCareError("quota_exceeded", "AI Care Guide quota is used for this month. Emergency guidance remains available.", 402);
  }

  const citations = selectKnowledgeChunks(question);
  const classification = unsafeMedicationPattern.test(question) ? "refusal" : "general";
  const draft = buildCareAnswer({
    locale,
    mode: classification === "refusal" ? "medication_refusal" : "general",
    citations,
    topic: scope.topic,
  });
  const affiliateSuggestions = await getAffiliateSuggestions(classification === "refusal" ? "clinic" : scope.topic ?? "general");
  const answer =
    classification === "general"
      ? (await rewriteCareAnswerWithGemini({
          locale,
          question,
          topic: scope.topic,
          draft,
          citations: citations.map((chunk) => chunk.id),
        })) ?? draft
      : draft;

  await store.saveSession({
    householdId: context.activeHousehold.id,
    question,
    answer,
    classification,
    citations: citations.map((chunk) => chunk.id),
  });

  return quotaResponse(answer, classification, citations.map((chunk) => chunk.id), used + 1, limit, true, scope, affiliateSuggestions);
}

function quotaResponse(
  answer: string,
  classification: AiCareResponse["classification"],
  citations: string[],
  used: number,
  limit: number,
  consumed: boolean,
  scope: AiCareResponse["scope"],
  affiliateSuggestions: AiCareResponse["affiliateSuggestions"],
): AiCareResponse {
  return {
    answer,
    classification,
    citations,
    scope,
    affiliateSuggestions,
    quota: {
      used,
      limit,
      remaining: Math.max(0, limit - used),
      consumed,
    },
  };
}
