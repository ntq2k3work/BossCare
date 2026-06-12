import { z, ZodError } from "zod";
import type { AuthContext } from "@/lib/auth/types";
import { AiCareError } from "./errors";
import type { AiCareResponse, AiCareStore } from "./types";

const askSchema = z.object({
  question: z.string().trim().min(3).max(1000),
});

const knowledge = [
  {
    id: "hydration",
    keywords: ["water", "drink", "hydration", "nuoc", "dehydration"],
    text: "Keep clean water available. If a pet refuses water, vomits repeatedly, or seems weak, contact a veterinarian.",
  },
  {
    id: "diet",
    keywords: ["food", "eat", "diet", "an", "meal", "appetite"],
    text: "Diet changes should be gradual over several days. Sudden appetite loss for more than a day needs veterinary advice.",
  },
  {
    id: "vaccination",
    keywords: ["vaccine", "vaccination", "tiem", "rabies"],
    text: "Keep vaccination records current and ask a clinic about local rabies and core vaccine schedules.",
  },
  {
    id: "stool",
    keywords: ["stool", "poop", "diarrhea", "phan", "tieu chay"],
    text: "Short mild stool changes can be monitored with hydration. Blood, repeated diarrhea, or lethargy needs veterinary care.",
  },
];

const emergencyPattern = /\b(cannot breathe|choking|seizure|unconscious|collapse|poison|bleeding|emergency|khong tho|co giat|ngo doc|chay mau)\b/i;
const unsafeMedicationPattern = /\b(dose|dosage|paracetamol|ibuprofen|antibiotic|thuoc nguoi|lieu luong)\b/i;

export async function askAiCareGuide(context: AuthContext, store: AiCareStore, input: unknown, now = new Date()): Promise<AiCareResponse> {
  if (!context.activeHousehold) throw new AiCareError("no_household", "No active household is available.", 403);
  let question: string;
  try {
    question = askSchema.parse(input).question;
  } catch (error) {
    if (error instanceof ZodError) throw new AiCareError("invalid_question", "Ask a clear pet care question.", 400);
    throw error;
  }

  const monthKey = now.toISOString().slice(0, 7);
  const used = await store.countSessions(context.activeHousehold.id, monthKey);
  const limit = context.entitlements.aiSessionsPerMonth;

  if (emergencyPattern.test(question)) {
    return quotaResponse(
      "Emergency warning: contact a veterinarian or emergency clinic now. Keep your pet calm, avoid giving human medicine, and bring any packaging or exposure details with you.",
      "emergency",
      ["emergency-safety"],
      used,
      limit,
      false,
    );
  }

  if (used >= limit) {
    throw new AiCareError("quota_exceeded", "AI Care Guide quota is used for this month. Emergency guidance remains available.", 402);
  }

  const lower = question.toLowerCase();
  const citations = knowledge.filter((chunk) => chunk.keywords.some((keyword) => lower.includes(keyword))).slice(0, 2);
  const classification = unsafeMedicationPattern.test(question) ? "refusal" : "general";
  const answer =
    classification === "refusal"
      ? "I cannot provide medication dosage or replace a veterinarian. Call your vet with your pet's weight, age, symptoms, and any medicine name before giving anything."
      : buildGeneralAnswer(citations);
  await store.saveSession({
    householdId: context.activeHousehold.id,
    question,
    answer,
    classification,
    citations: citations.map((chunk) => chunk.id),
  });
  return quotaResponse(answer, classification, citations.map((chunk) => chunk.id), used + 1, limit, true);
}

function buildGeneralAnswer(citations: typeof knowledge) {
  const sourceText = citations.length ? citations.map((chunk) => chunk.text).join(" ") : "Monitor behavior, appetite, water intake, stool, and energy. If symptoms persist or worsen, call a veterinarian.";
  return `${sourceText} This guide is educational and does not replace a veterinarian.`;
}

function quotaResponse(
  answer: string,
  classification: AiCareResponse["classification"],
  citations: string[],
  used: number,
  limit: number,
  consumed: boolean,
): AiCareResponse {
  return {
    answer,
    classification,
    citations,
    quota: {
      used,
      limit,
      remaining: Math.max(0, limit - used),
      consumed,
    },
  };
}
