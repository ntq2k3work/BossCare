export type PetCareTopic = "general" | "health" | "food" | "clothing" | "clinic" | "spa" | "grooming" | "training" | "accessories";

export type AiCareScope = {
  allowed: boolean;
  topic: PetCareTopic | null;
  reason: "pet_topic" | "out_of_scope";
  matchedKeywords: string[];
};

const TOPIC_MATCHERS: Array<{
  topic: PetCareTopic;
  keywords: string[];
}> = [
  {
    topic: "clinic",
    keywords: [
      "phong kham thu y",
      "bac si thu y",
      "thu y",
      "vet clinic",
      "vet",
      "clinic",
      "kham thu y",
      "dat lich kham",
      "examination",
    ],
  },
  {
    topic: "health",
    keywords: [
      "suc khoe thu cung",
      "pet health",
      "dog health",
      "cat health",
      "sick",
      "symptom",
      "symptoms",
      "fever",
      "vomit",
      "nausea",
      "diarrhea",
      "tieu chay",
      "non",
      "met moi",
      "met",
      "ngua",
      "allergy",
      "tiem phong",
      "vaccination",
      "vaccine",
      "rabies",
      "worm",
      "flea",
      "tick",
    ],
  },
  {
    topic: "food",
    keywords: [
      "thuc an cho cho",
      "thuc an cho meo",
      "pet food",
      "dog food",
      "cat food",
      "hat cho cho",
      "hat cho meo",
      "pate cho meo",
      "food for dog",
      "food for cat",
      "an gi cho cho",
      "an gi cho meo",
      "meal plan",
      "feeding",
      "diet",
      "nutrition",
      "snack cho cho",
      "snack cho meo",
    ],
  },
  {
    topic: "clothing",
    keywords: [
      "ao cho cho",
      "ao cho meo",
      "quan ao thu cung",
      "pet clothing",
      "dog clothes",
      "cat clothes",
      "raincoat",
      "ao mua",
      "ao len",
      "jacket",
      "vest",
      "outfit",
    ],
  },
  {
    topic: "spa",
    keywords: [
      "spa thu cung",
      "spa",
      "grooming",
      "pet grooming",
      "tam cho cho",
      "tam cho meo",
      "cat long",
      "cat mong",
      "brush",
      "bath",
      "bath time",
      "wash",
    ],
  },
  {
    topic: "grooming",
    keywords: [
      "grooming",
      "pet grooming",
      "cat long",
      "cat mong",
      "trim fur",
      "brush fur",
      "cham soc long",
      "lam dep",
      "van dong lam dep",
    ],
  },
  {
    topic: "training",
    keywords: [
      "huan luyen",
      "pet training",
      "dog training",
      "cat training",
      "obedience",
      "behavior",
      "behaviour",
      "barking",
      "an toan",
      "loi noi",
      "command",
      "trick",
    ],
  },
  {
    topic: "accessories",
    keywords: [
      "vong co",
      "day dan",
      "leash",
      "collar",
      "harness",
      "carrier",
      "crate",
      "giuong cho cho",
      "giuong cho meo",
      "bed",
      "bowl",
      "feeder",
      "toy",
      "cat tree",
      "cat ve sinh",
      "litter",
    ],
  },
  {
    topic: "general",
    keywords: [
      "thu cung",
      "pet",
      "pet care",
      "cham soc thu cung",
      "cham boss",
      "boss",
      "boss cua tui",
      "cho",
      "meo",
      "cun",
      "puppy",
      "kitten",
      "dog",
      "cat",
      "boss meo",
      "boss cho",
    ],
  },
];

export function normalizeQuestion(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesKeyword(normalizedQuestion: string, keyword: string) {
  return normalizedQuestion.includes(normalizeQuestion(keyword));
}

export function classifyPetCareQuestion(question: string): AiCareScope {
  const normalizedQuestion = normalizeQuestion(question);
  const matches: string[] = [];

  for (const matcher of TOPIC_MATCHERS) {
    const keyword = matcher.keywords.find((item) => includesKeyword(normalizedQuestion, item));
    if (keyword) {
      matches.push(keyword);
      return {
        allowed: true,
        topic: matcher.topic,
        reason: "pet_topic",
        matchedKeywords: matches,
      };
    }
  }

  return {
    allowed: false,
    topic: null,
    reason: "out_of_scope",
    matchedKeywords: [],
  };
}

export function isPetCareQuestion(question: string) {
  return classifyPetCareQuestion(question).allowed;
}
