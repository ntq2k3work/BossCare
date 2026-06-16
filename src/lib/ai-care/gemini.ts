import type { Locale } from "@/lib/i18n";
import type { PetCareTopic } from "./guard";

const DEFAULT_GEMINI_MODEL = "gemini-3.1-flash-lite";
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

type GeminiCandidate = {
  content?: {
    parts?: Array<{
      text?: string;
    }>;
  };
};

type GeminiGenerateContentResponse = {
  candidates?: GeminiCandidate[];
  promptFeedback?: {
    blockReason?: string;
  };
};

export async function rewriteCareAnswerWithGemini({
  locale,
  question,
  topic,
  draft,
  citations,
}: {
  locale: Locale;
  question: string;
  topic: PetCareTopic | null;
  draft: string;
  citations: string[];
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  const response = await fetch(`${GEMINI_API_BASE}/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [
          {
            text:
              "You are BossCare AI Care Guide. Rewrite the draft answer for a pet owner. Keep the same meaning, the same section labels, and the same language as the draft. Do not add new medical facts, do not mention policy, and do not mention that you are an AI model. Be concise and practical.",
          },
        ],
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: [
                `Locale: ${locale}`,
                `Topic: ${topic ?? "general"}`,
                `Question: ${question}`,
                `Citations: ${citations.length ? citations.join(", ") : "none"}`,
                "",
                "Draft answer:",
                draft,
                "",
                "Return only the rewritten answer.",
              ].join("\n"),
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 512,
      },
    }),
  });

  if (!response.ok) {
    return null;
  }

  const body = (await response.json()) as GeminiGenerateContentResponse;
  const text = extractGeminiText(body);
  return text ? sanitizeGeminiText(text) : null;
}

function extractGeminiText(body: GeminiGenerateContentResponse) {
  const candidate = body.candidates?.[0];
  const parts = candidate?.content?.parts ?? [];
  const text = parts.map((part) => part.text ?? "").join("").trim();
  return text || null;
}

function sanitizeGeminiText(text: string) {
  return text.replace(/^```(?:text)?\s*/i, "").replace(/\s*```$/i, "").trim();
}
