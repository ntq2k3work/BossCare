import type { AffiliateSuggestion } from "@/lib/affiliate-links/types";
import type { AiCareScope } from "./guard";

export type AiCareSession = {
  id: string;
  householdId: string;
  question: string;
  answer: string;
  classification: "general" | "refusal" | "emergency";
  citations: string[];
  createdAt: string;
};

export type AiCareResponse = {
  answer: string;
  classification: AiCareSession["classification"];
  citations: string[];
  scope: AiCareScope;
  affiliateSuggestions: AffiliateSuggestion[];
  quota: {
    used: number;
    limit: number;
    remaining: number;
    consumed: boolean;
  };
};

export interface AiCareStore {
  countSessions(householdId: string, monthKey: string): Promise<number>;
  saveSession(input: Omit<AiCareSession, "id" | "createdAt">): Promise<AiCareSession>;
}
