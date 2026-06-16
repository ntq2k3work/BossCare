import { beforeEach, describe, expect, it, vi } from "vitest";
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
  it("answers general questions with trusted citations, affiliate suggestions, and quota", async () => {
    const response = await askAiCareGuide(context, store, {
      question: "My dog has diarrhea, what should I monitor?",
      locale: "en",
    });
    expect(response.classification).toBe("general");
    expect(response.citations).toContain("stool");
    expect(response.scope.allowed).toBe(true);
    expect(response.affiliateSuggestions.length).toBeGreaterThan(0);
    expect(response.quota).toMatchObject({ used: 1, consumed: true });
  });

  it("refuses medication dosage questions", async () => {
    const response = await askAiCareGuide(context, store, {
      question: "What ibuprofen dosage can I give my cat?",
      locale: "en",
    });
    expect(response.classification).toBe("refusal");
    expect(response.answer).toMatch(/cannot provide medication dosage/i);
    expect(response.affiliateSuggestions[0]?.category).toBe("clinic");
  });

  it("blocks out-of-scope questions before any AI answer is produced", async () => {
    const response = await askAiCareGuide(context, store, {
      question: "Write me a travel itinerary for Japan.",
      locale: "en",
    });
    expect(response.classification).toBe("refusal");
    expect(response.scope.allowed).toBe(false);
    expect(response.scope.reason).toBe("out_of_scope");
    expect(response.quota).toMatchObject({ used: 0, consumed: false });
  });

  it("does not consume quota for emergency warnings", async () => {
    const response = await askAiCareGuide(context, store, {
      question: "My dog cannot breathe, is this emergency?",
      locale: "en",
    });
    expect(response.classification).toBe("emergency");
    expect(response.quota).toMatchObject({ used: 0, consumed: false });
    expect(response.affiliateSuggestions).toHaveLength(0);
  });

  it("returns a Vietnamese answer structure when locale is vi", async () => {
    const response = await askAiCareGuide(context, store, {
      question: "Chó nhà mình bị tiêu chảy, mình nên theo dõi gì?",
      locale: "vi",
    });
    expect(response.answer).toContain("Trả lời ngắn");
    expect(response.answer).toContain("Cần theo dõi");
  });

  it("rewrites general answers with Gemini 3.1 Flash-Lite when configured", async () => {
    const previousApiKey = process.env.GEMINI_API_KEY;
    const previousModel = process.env.GEMINI_MODEL;
    process.env.GEMINI_API_KEY = "test-gemini-key";
    process.env.GEMINI_MODEL = "gemini-3.1-flash-lite";

    const fetchMock = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: "Short answer: Model rewrite.\nWhy it matters: Model rewrite.\nWhat to watch: Model rewrite.\nWhat to do next: Model rewrite.\nWhen to contact a vet: Model rewrite.",
                  },
                ],
              },
            },
          ],
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      );
    });

    vi.stubGlobal("fetch", fetchMock);

    try {
      const response = await askAiCareGuide(context, store, {
        question: "My dog has diarrhea, what should I monitor?",
        locale: "en",
      });

      expect(response.answer).toContain("Model rewrite.");
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(String(url)).toContain("gemini-3.1-flash-lite:generateContent");
      expect(new Headers((init as RequestInit | undefined)?.headers ?? {}).get("x-goog-api-key")).toBe("test-gemini-key");
    } finally {
      vi.unstubAllGlobals();
      if (previousApiKey === undefined) {
        delete process.env.GEMINI_API_KEY;
      } else {
        process.env.GEMINI_API_KEY = previousApiKey;
      }
      if (previousModel === undefined) {
        delete process.env.GEMINI_MODEL;
      } else {
        process.env.GEMINI_MODEL = previousModel;
      }
    }
  });
});
