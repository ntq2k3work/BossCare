import { beforeEach, describe, expect, it } from "vitest";
import { MemoryAuthStore } from "@/lib/auth/memory-store";
import { registerUser } from "@/lib/auth/service";
import type { AuthContext } from "@/lib/auth/types";
import { MemoryAiCareStore } from "./memory-store";
import { askAiCareGuide } from "./service";

let context: AuthContext;
let store: MemoryAiCareStore;

beforeEach(async () => {
  store = new MemoryAiCareStore();
  context = (await registerUser(new MemoryAuthStore(), {
    email: "linh@example.com",
    displayName: "Linh Nguyen",
    password: "password123",
    householdName: "Linh household",
  })).context;
});

describe("AI Care Guide", () => {
  it("answers general questions with trusted citations and quota", async () => {
    const response = await askAiCareGuide(context, store, { question: "My dog has diarrhea, what should I monitor?" });
    expect(response.classification).toBe("general");
    expect(response.citations).toContain("stool");
    expect(response.quota).toMatchObject({ used: 1, consumed: true });
  });

  it("refuses medication dosage questions", async () => {
    const response = await askAiCareGuide(context, store, { question: "What ibuprofen dosage can I give my cat?" });
    expect(response.classification).toBe("refusal");
    expect(response.answer).toMatch(/cannot provide medication dosage/i);
  });

  it("does not consume quota for emergency warnings", async () => {
    const response = await askAiCareGuide(context, store, { question: "My dog cannot breathe, is this emergency?" });
    expect(response.classification).toBe("emergency");
    expect(response.quota).toMatchObject({ used: 0, consumed: false });
  });
});
