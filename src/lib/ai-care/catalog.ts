import type { Locale } from "@/lib/i18n";
import type { PetCareTopic } from "./guard";
import { normalizeQuestion } from "./guard";

type LocalizedText = Record<Locale, string>;

export type CareKnowledgeChunk = {
  id: string;
  keywords: string[];
  answer: LocalizedText;
  watch: LocalizedText;
  next: LocalizedText;
  vet: LocalizedText;
};

const careCopy = {
  vi: {
    shortAnswer: "Trả lời ngắn",
    whyItMatters: "Vì sao quan trọng",
    watch: "Cần theo dõi",
    nextStep: "Nên làm gì tiếp theo",
    contactVet: "Khi nào cần gặp bác sĩ thú y",
    outOfScope: "Mình chỉ hỗ trợ câu hỏi liên quan đến thú cưng như sức khỏe, đồ ăn, quần áo, phòng khám, spa, grooming, huấn luyện và phụ kiện.",
    medicationRefusal: "Mình không thể hướng dẫn liều lượng thuốc. Hãy gọi bác sĩ thú y với cân nặng, tuổi, triệu chứng và tên thuốc trước khi cho bé dùng.",
    emergency: "Đây có thể là tình huống khẩn cấp. Hãy liên hệ phòng khám thú y ngay, giữ bé bình tĩnh và không cho thuốc người.",
    defaultWhy: "Theo dõi sớm giúp phát hiện dấu hiệu nặng hơn trước khi thành vấn đề lớn.",
    petKeywords: {
      health: "Sức khỏe thú cưng cần theo dõi sát.",
      food: "Thay đổi đồ ăn ảnh hưởng trực tiếp tới tiêu hóa.",
      clothing: "Đồ mặc phải vừa vặn và thoải mái.",
      clinic: "Chuẩn bị kỹ trước khi đến phòng khám sẽ giúp buổi khám hiệu quả hơn.",
      spa: "Grooming nhẹ nhàng giúp bé ít stress hơn.",
      grooming: "Chăm lông và da đúng cách giúp bé dễ chịu hơn.",
      training: "Huấn luyện ngắn và nhất quán giúp bé học nhanh hơn.",
      accessories: "Phụ kiện an toàn, đúng size sẽ giảm nguy cơ tai nạn.",
      general: "Theo dõi ăn uống, nước, phân, tinh thần và mức năng lượng của bé.",
    } satisfies Record<PetCareTopic, string>,
    fallbackWatch: {
      health: "Ăn uống, nước, phân, mức tỉnh táo và thay đổi hành vi.",
      food: "Phân, nôn, đầy bụng, ngứa hoặc bỏ ăn.",
      clothing: "Da ở cổ, nách và bụng có bị cọ xát hay nóng bí không.",
      clinic: "Sốt, nôn, ho, bỏ ăn hoặc dấu hiệu đau kéo dài.",
      spa: "Da đỏ, trầy xước, tai nạn khi cắt tỉa hoặc bé quá căng thẳng.",
      grooming: "Da đỏ, rụng lông bất thường, ngứa nhiều hoặc vết cắt nhỏ.",
      training: "Bé có sợ hãi, stress hoặc hành vi xấu đi sau khi tập không.",
      accessories: "Phụ kiện có quá chật, quá lỏng, dễ nuốt hay gây vướng không.",
      general: "Ăn uống, nước, phân, tinh thần và mức năng lượng của bé.",
    } satisfies Record<PetCareTopic, string>,
    fallbackNext: {
      health: "Ghi lại triệu chứng và theo dõi trong 24 giờ nếu bé vẫn tỉnh táo.",
      food: "Đổi đồ ăn mới từ từ trong vài ngày và giữ nước sạch.",
      clothing: "Chọn chất liệu mềm, vừa size và cho bé làm quen dần.",
      clinic: "Chuẩn bị sổ tiêm, cân nặng, triệu chứng và câu hỏi trước khi đi khám.",
      spa: "Chọn nơi vệ sinh dụng cụ sạch, thao tác chậm và dừng nếu bé quá căng thẳng.",
      grooming: "Chải nhẹ, tỉa nhỏ từng bước và kiểm tra da sau khi làm.",
      training: "Tập từng lệnh ngắn, lặp lại nhất quán và thưởng đúng lúc.",
      accessories: "Ưu tiên phụ kiện vừa size, không có chi tiết dễ nuốt và luôn kiểm tra độ chắc.",
      general: "Ghi lại triệu chứng và theo dõi trong 24 giờ nếu bé vẫn tỉnh táo.",
    } satisfies Record<PetCareTopic, string>,
    fallbackVet: {
      health: "Đi khám sớm nếu bé lừ đừ, nôn liên tục, có máu, khó thở hoặc không uống được nước.",
      food: "Đi khám nếu bé bỏ ăn hơn 24 giờ, tiêu chảy kéo dài hoặc có máu.",
      clothing: "Cởi đồ ngay nếu da đỏ, bé khó thở hoặc có dấu hiệu kích ứng.",
      clinic: "Liên hệ bác sĩ thú y ngay nếu triệu chứng nặng, đau tăng hoặc bé yếu nhanh.",
      spa: "Liên hệ bác sĩ thú y nếu có vết cắt, sưng, đau hoặc kích ứng da sau grooming.",
      grooming: "Liên hệ bác sĩ thú y nếu có vết cắt, sưng, đau hoặc kích ứng da sau grooming.",
      training: "Đi khám nếu hành vi thay đổi đột ngột hoặc bé có dấu hiệu đau, sợ hãi kéo dài.",
      accessories: "Đi khám nếu bé bị vướng, nuốt phải phụ kiện hoặc có vết hằn trên da.",
      general: "Đi khám sớm nếu bé lừ đừ, nôn liên tục, có máu, khó thở hoặc không uống được nước.",
    } satisfies Record<PetCareTopic, string>,
  },
  en: {
    shortAnswer: "Short answer",
    whyItMatters: "Why it matters",
    watch: "What to watch",
    nextStep: "What to do next",
    contactVet: "When to contact a vet",
    outOfScope: "I only help with pet topics such as health, food, clothing, clinics, spa, grooming, training, and accessories.",
    medicationRefusal: "I cannot provide medication dosage. Call a vet with your pet's weight, age, symptoms, and the medicine name before giving anything.",
    emergency: "This may be an emergency. Contact a vet clinic now, keep your pet calm, and do not give human medication.",
    defaultWhy: "Early monitoring helps catch worsening signs before they become a bigger problem.",
    petKeywords: {
      health: "Pet health needs close monitoring.",
      food: "Food changes directly affect digestion.",
      clothing: "Clothing must fit well and stay comfortable.",
      clinic: "Preparing for the clinic makes the visit more effective.",
      spa: "Gentle grooming keeps stress lower.",
      grooming: "Good coat and skin care keeps pets comfortable.",
      training: "Short, consistent training helps pets learn faster.",
      accessories: "Safe, well-fitted accessories reduce accident risk.",
      general: "Watch appetite, water intake, stool, mood, and energy.",
    } satisfies Record<PetCareTopic, string>,
    fallbackWatch: {
      health: "Appetite, water intake, stool, alertness, and behavior changes.",
      food: "Stool, vomiting, bloating, itching, or refusing meals.",
      clothing: "Redness around the neck, armpits, or belly, or overheating.",
      clinic: "Fever, vomiting, coughing, not eating, or ongoing pain signs.",
      spa: "Red skin, scratches, clipping accidents, or obvious stress.",
      grooming: "Red skin, unusual hair loss, heavy itching, or small cuts.",
      training: "Fear, stress, or behavior getting worse after training.",
      accessories: "Too tight, too loose, easy-to-swallow, or snagging parts.",
      general: "Appetite, water intake, stool, mood, and energy.",
    } satisfies Record<PetCareTopic, string>,
    fallbackNext: {
      health: "Record the symptoms and monitor for 24 hours if your pet is still alert.",
      food: "Transition to new food slowly over a few days and keep fresh water available.",
      clothing: "Choose soft fabric, proper fit, and let your pet adjust gradually.",
      clinic: "Prepare vaccination records, weight, symptoms, and questions before the visit.",
      spa: "Pick a clean grooming place, keep handling slow, and stop if your pet is too stressed.",
      grooming: "Brush gently, trim in small steps, and check the skin afterward.",
      training: "Use short sessions, stay consistent, and reward at the right moment.",
      accessories: "Choose well-fitted, safe accessories with no easily swallowed parts.",
      general: "Record the symptoms and monitor for 24 hours if your pet is still alert.",
    } satisfies Record<PetCareTopic, string>,
    fallbackVet: {
      health: "Seek care soon if your pet is lethargic, vomiting repeatedly, bleeding, struggling to breathe, or cannot keep water down.",
      food: "Seek care if your pet stops eating for more than 24 hours, has ongoing diarrhea, or blood appears.",
      clothing: "Take clothing off immediately if there is redness, breathing trouble, or irritation.",
      clinic: "Contact a vet right away if symptoms are severe, worsening, or your pet is getting weak quickly.",
      spa: "Contact a vet if there are cuts, swelling, pain, or skin irritation after grooming.",
      grooming: "Contact a vet if there are cuts, swelling, pain, or skin irritation after grooming.",
      training: "See a vet if behavior changes suddenly or your pet seems in pain or frightened for a long time.",
      accessories: "See a vet if your pet gets stuck, swallows a part, or has pressure marks on the skin.",
      general: "Seek care soon if your pet is lethargic, vomiting repeatedly, bleeding, struggling to breathe, or cannot keep water down.",
    } satisfies Record<PetCareTopic, string>,
  },
} as const;

export const CARE_KNOWLEDGE: CareKnowledgeChunk[] = [
  {
    id: "hydration",
    keywords: ["nuoc", "water", "hydration", "dehydration", "khong uong nuoc", "mat nuoc"],
    answer: {
      vi: "Luôn để nước sạch sẵn và theo dõi xem bé có uống đều không.",
      en: "Keep fresh water available and watch whether your pet is drinking regularly.",
    },
    watch: {
      vi: "Nếu bé uống rất ít, nôn nhiều, lờ đờ hoặc nướu khô, cần gọi bác sĩ thú y.",
      en: "If your pet drinks very little, vomits repeatedly, seems lethargic, or has dry gums, call a vet.",
    },
    next: {
      vi: "Cho uống từng ngụm nhỏ và ghi lại thời điểm bé uống nước.",
      en: "Offer small sips and note when your pet drinks.",
    },
    vet: {
      vi: "Đi khám sớm nếu bé không giữ được nước hoặc có dấu hiệu mất nước.",
      en: "Seek care soon if your pet cannot keep water down or shows dehydration.",
    },
  },
  {
    id: "diet",
    keywords: ["thuc an", "food", "an uong", "appetite", "hat", "pate", "diet", "nutrition", "feeding"],
    answer: {
      vi: "Thay đổi thức ăn từ từ trong 5-7 ngày để tránh rối loạn tiêu hóa.",
      en: "Change food gradually over 5-7 days to avoid digestive upset.",
    },
    watch: {
      vi: "Theo dõi phân, nôn, đầy bụng, ngứa hoặc bỏ ăn.",
      en: "Watch for stool changes, vomiting, bloating, itching, or refusing meals.",
    },
    next: {
      vi: "Trộn thức ăn mới với thức ăn cũ theo tỷ lệ tăng dần và giữ nước sạch.",
      en: "Mix the new food with the old one in gradually increasing amounts and keep fresh water available.",
    },
    vet: {
      vi: "Nếu bé bỏ ăn hơn 24 giờ hoặc tiêu chảy kéo dài, hãy hỏi phòng khám.",
      en: "If your pet refuses food for more than 24 hours or has ongoing diarrhea, ask a clinic.",
    },
  },
  {
    id: "vaccination",
    keywords: ["vaccine", "vaccination", "tiem phong", "tiem", "rabies", "thu y", "phong kham", "vet"],
    answer: {
      vi: "Giữ hồ sơ tiêm phòng và lịch khám định kỳ để phòng bệnh sớm.",
      en: "Keep vaccination records and regular checkups to catch problems early.",
    },
    watch: {
      vi: "Theo dõi sốt, sưng đau nơi tiêm hoặc mệt kéo dài sau lịch hẹn.",
      en: "Watch for fever, swelling at the injection site, or prolonged fatigue after the appointment.",
    },
    next: {
      vi: "Chuẩn bị sổ tiêm, cân nặng và câu hỏi trước khi đến phòng khám.",
      en: "Prepare vaccination records, weight, and questions before the clinic visit.",
    },
    vet: {
      vi: "Liên hệ bác sĩ thú y nếu bé có phản ứng nặng sau tiêm.",
      en: "Contact a vet if your pet has a severe reaction after vaccination.",
    },
  },
  {
    id: "stool",
    keywords: ["tieu chay", "diarrhea", "phan", "poop", "stool", "non", "vomit", "nau", "tai", "bowel"],
    answer: {
      vi: "Rối loạn tiêu hóa nhẹ có thể theo dõi ngắn hạn, nhưng cần chú ý nước uống.",
      en: "Mild digestive upset can be watched briefly, but keep an eye on water intake.",
    },
    watch: {
      vi: "Theo dõi số lần đi ngoài, có máu, mùi lạ, nôn hoặc lờ đờ.",
      en: "Watch the number of bowel movements, blood, strange odor, vomiting, or lethargy.",
    },
    next: {
      vi: "Giữ nước sạch, ghi lại tần suất và loại thức ăn gần nhất.",
      en: "Keep fresh water available and note the frequency and the most recent food changes.",
    },
    vet: {
      vi: "Nếu có máu, nôn liên tục, lừ đừ hoặc tiêu chảy kéo dài, hãy đi khám.",
      en: "If there is blood, repeated vomiting, lethargy, or prolonged diarrhea, see a vet.",
    },
  },
  {
    id: "grooming",
    keywords: ["spa", "grooming", "tam", "cat long", "cat mong", "brush", "bath", "wash", "lam dep"],
    answer: {
      vi: "Spa và grooming nên làm nhẹ nhàng để bé ít stress và da không bị kích ứng.",
      en: "Spa and grooming should be gentle so your pet stays calmer and the skin stays comfortable.",
    },
    watch: {
      vi: "Theo dõi da đỏ, trầy xước, run sợ hoặc tai nạn khi cắt tỉa.",
      en: "Watch for red skin, scratches, fear, or clipping accidents.",
    },
    next: {
      vi: "Chọn nơi vệ sinh dụng cụ sạch và yêu cầu thao tác chậm với bé.",
      en: "Choose a place with clean tools and ask for slow, gentle handling.",
    },
    vet: {
      vi: "Nếu da đỏ lan rộng, ngứa nhiều hoặc có vết cắt, hãy hỏi bác sĩ thú y.",
      en: "If redness spreads, itching is heavy, or there are cuts, ask a vet.",
    },
  },
  {
    id: "clothing",
    keywords: ["ao", "ao mua", "ao len", "quanao", "clothing", "raincoat", "jacket", "outfit", "vest"],
    answer: {
      vi: "Quần áo thú cưng phải vừa vặn, thoáng và không cọ xát vào da.",
      en: "Pet clothing should fit well, stay breathable, and avoid rubbing the skin.",
    },
    watch: {
      vi: "Theo dõi cổ, nách, bụng có bị cọ xát, bí nóng hay khiến bé khó chịu không.",
      en: "Watch the neck, armpits, and belly for rubbing, overheating, or obvious discomfort.",
    },
    next: {
      vi: "Chọn chất liệu mềm, dễ giặt và cho bé làm quen dần.",
      en: "Choose soft, washable fabric and let your pet get used to it gradually.",
    },
    vet: {
      vi: "Cởi đồ ngay nếu da đỏ, bé khó thở hoặc có dấu hiệu kích ứng.",
      en: "Take clothing off right away if there is redness, breathing trouble, or irritation.",
    },
  },
  {
    id: "training",
    keywords: ["huan luyen", "training", "obedience", "behavior", "behaviour", "barking", "lenh", "ngoi", "nam"],
    answer: {
      vi: "Huấn luyện ngắn, lặp lại nhất quán và thưởng đúng lúc thường hiệu quả hơn.",
      en: "Short, consistent training with timely rewards usually works better.",
    },
    watch: {
      vi: "Theo dõi mức stress, sợ hãi hoặc hành vi xấu đi sau buổi tập.",
      en: "Watch for stress, fear, or behavior getting worse after a session.",
    },
    next: {
      vi: "Tập từng lệnh ngắn, dùng tín hiệu rõ ràng và dừng khi bé mệt.",
      en: "Use short sessions, clear cues, and stop when your pet gets tired.",
    },
    vet: {
      vi: "Đi khám nếu hành vi thay đổi đột ngột hoặc bé có dấu hiệu đau kéo dài.",
      en: "See a vet if behavior changes suddenly or your pet seems in pain for a long time.",
    },
  },
  {
    id: "accessories",
    keywords: ["vong co", "day dan", "leash", "collar", "harness", "carrier", "crate", "bed", "bowl", "feeder", "toy", "litter"],
    answer: {
      vi: "Phụ kiện nên vừa size, an toàn và không có chi tiết dễ nuốt.",
      en: "Accessories should fit well, stay safe, and avoid small swallowable parts.",
    },
    watch: {
      vi: "Kiểm tra xem phụ kiện có quá chật, quá lỏng, gây vướng hay hằn lên da không.",
      en: "Check whether the accessory is too tight, too loose, snagging, or leaving marks on the skin.",
    },
    next: {
      vi: "Ưu tiên đồ chắc, vừa size và luôn kiểm tra độ an toàn trước khi dùng.",
      en: "Choose sturdy, well-fitted items and check safety before each use.",
    },
    vet: {
      vi: "Đi khám nếu bé bị vướng, nuốt phải phụ kiện hoặc có vết hằn trên da.",
      en: "See a vet if your pet gets stuck, swallows a part, or has pressure marks on the skin.",
    },
  },
];

const TOPIC_FALLBACKS: Record<PetCareTopic, { watch: LocalizedText; next: LocalizedText; vet: LocalizedText }> = {
  health: {
    watch: {
      vi: careCopy.vi.fallbackWatch.health,
      en: careCopy.en.fallbackWatch.health,
    },
    next: {
      vi: careCopy.vi.fallbackNext.health,
      en: careCopy.en.fallbackNext.health,
    },
    vet: {
      vi: careCopy.vi.fallbackVet.health,
      en: careCopy.en.fallbackVet.health,
    },
  },
  food: {
    watch: {
      vi: careCopy.vi.fallbackWatch.food,
      en: careCopy.en.fallbackWatch.food,
    },
    next: {
      vi: careCopy.vi.fallbackNext.food,
      en: careCopy.en.fallbackNext.food,
    },
    vet: {
      vi: careCopy.vi.fallbackVet.food,
      en: careCopy.en.fallbackVet.food,
    },
  },
  clothing: {
    watch: {
      vi: careCopy.vi.fallbackWatch.clothing,
      en: careCopy.en.fallbackWatch.clothing,
    },
    next: {
      vi: careCopy.vi.fallbackNext.clothing,
      en: careCopy.en.fallbackNext.clothing,
    },
    vet: {
      vi: careCopy.vi.fallbackVet.clothing,
      en: careCopy.en.fallbackVet.clothing,
    },
  },
  clinic: {
    watch: {
      vi: careCopy.vi.fallbackWatch.clinic,
      en: careCopy.en.fallbackWatch.clinic,
    },
    next: {
      vi: careCopy.vi.fallbackNext.clinic,
      en: careCopy.en.fallbackNext.clinic,
    },
    vet: {
      vi: careCopy.vi.fallbackVet.clinic,
      en: careCopy.en.fallbackVet.clinic,
    },
  },
  spa: {
    watch: {
      vi: careCopy.vi.fallbackWatch.spa,
      en: careCopy.en.fallbackWatch.spa,
    },
    next: {
      vi: careCopy.vi.fallbackNext.spa,
      en: careCopy.en.fallbackNext.spa,
    },
    vet: {
      vi: careCopy.vi.fallbackVet.spa,
      en: careCopy.en.fallbackVet.spa,
    },
  },
  grooming: {
    watch: {
      vi: careCopy.vi.fallbackWatch.grooming,
      en: careCopy.en.fallbackWatch.grooming,
    },
    next: {
      vi: careCopy.vi.fallbackNext.grooming,
      en: careCopy.en.fallbackNext.grooming,
    },
    vet: {
      vi: careCopy.vi.fallbackVet.grooming,
      en: careCopy.en.fallbackVet.grooming,
    },
  },
  training: {
    watch: {
      vi: careCopy.vi.fallbackWatch.training,
      en: careCopy.en.fallbackWatch.training,
    },
    next: {
      vi: careCopy.vi.fallbackNext.training,
      en: careCopy.en.fallbackNext.training,
    },
    vet: {
      vi: careCopy.vi.fallbackVet.training,
      en: careCopy.en.fallbackVet.training,
    },
  },
  accessories: {
    watch: {
      vi: careCopy.vi.fallbackWatch.accessories,
      en: careCopy.en.fallbackWatch.accessories,
    },
    next: {
      vi: careCopy.vi.fallbackNext.accessories,
      en: careCopy.en.fallbackNext.accessories,
    },
    vet: {
      vi: careCopy.vi.fallbackVet.accessories,
      en: careCopy.en.fallbackVet.accessories,
    },
  },
  general: {
    watch: {
      vi: careCopy.vi.fallbackWatch.general,
      en: careCopy.en.fallbackWatch.general,
    },
    next: {
      vi: careCopy.vi.fallbackNext.general,
      en: careCopy.en.fallbackNext.general,
    },
    vet: {
      vi: careCopy.vi.fallbackVet.general,
      en: careCopy.en.fallbackVet.general,
    },
  },
};

function getTopicFallback(topic: PetCareTopic | null, locale: Locale) {
  const fallback = TOPIC_FALLBACKS[topic ?? "general"];
  return {
    watch: fallback.watch[locale],
    next: fallback.next[locale],
    vet: fallback.vet[locale],
  };
}

export function selectKnowledgeChunks(question: string) {
  const normalizedQuestion = normalizeQuestion(question);
  return CARE_KNOWLEDGE.filter((chunk) => chunk.keywords.some((keyword) => normalizedQuestion.includes(normalizeQuestion(keyword)))).slice(0, 2);
}

function formatSections(locale: Locale, sections: Array<[string, string]>) {
  return sections
    .filter(([, value]) => value.trim().length > 0)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

export function buildCareAnswer({
  locale,
  mode,
  citations,
  topic,
}: {
  locale: Locale;
  mode: "general" | "medication_refusal" | "emergency" | "out_of_scope";
  citations: CareKnowledgeChunk[];
  topic: PetCareTopic | null;
}) {
  const fallback = getTopicFallback(topic, locale);
  const copy = careCopy[locale];

  if (mode === "out_of_scope") {
    return formatSections(locale, [
      [copy.shortAnswer, copy.outOfScope],
      [copy.whyItMatters, copy.defaultWhy],
      [
        copy.watch,
        locale === "vi"
          ? "Câu hỏi này nằm ngoài phạm vi nên không có dấu hiệu thú cưng nào cần theo dõi."
          : "This question is outside scope, so there are no pet-care signs to watch.",
      ],
      [
        copy.nextStep,
        locale === "vi"
          ? "Hãy hỏi về sức khỏe, đồ ăn, quần áo, phòng khám, spa, grooming, huấn luyện hoặc phụ kiện."
          : "Please ask about health, food, clothing, clinics, spa, grooming, training, or accessories.",
      ],
      [copy.contactVet, locale === "vi" ? "Không áp dụng." : "Not applicable."],
    ]);
  }

  if (mode === "emergency") {
    return formatSections(locale, [
      [copy.shortAnswer, copy.emergency],
      [copy.whyItMatters, copy.defaultWhy],
      [copy.watch, locale === "vi" ? "Khó thở, co giật, ngất, chảy máu nhiều hoặc bụng chướng." : "Breathing trouble, seizures, collapse, heavy bleeding, or a bloated abdomen."],
      [copy.nextStep, locale === "vi" ? "Đưa bé đến phòng khám thú y ngay và giữ bé bình tĩnh." : "Go to a vet clinic now and keep your pet calm."],
      [copy.contactVet, locale === "vi" ? "Ngay lập tức." : "Immediately."],
    ]);
  }

  if (mode === "medication_refusal") {
    return formatSections(locale, [
      [copy.shortAnswer, copy.medicationRefusal],
      [copy.whyItMatters, locale === "vi" ? "Liều lượng phụ thuộc vào cân nặng, tuổi, loài và bệnh nền." : "Dosage depends on weight, age, species, and health history."],
      [copy.watch, fallback.watch],
      [copy.nextStep, locale === "vi" ? "Hãy gọi bác sĩ thú y với cân nặng, tuổi, triệu chứng và tên thuốc trước khi cho bé dùng." : "Call a vet with your pet's weight, age, symptoms, and the medicine name before giving anything."],
      [copy.contactVet, locale === "vi" ? "Nên hỏi bác sĩ thú y trước khi dùng bất kỳ thuốc nào." : "Check with a vet before giving any medicine."],
    ]);
  }

  const answer = citations.map((citation) => citation.answer[locale]).join(" ");
  const watch = citations.map((citation) => citation.watch[locale]).join(" ");
  const next = citations.map((citation) => citation.next[locale]).join(" ");
  const vet = citations.map((citation) => citation.vet[locale]).join(" ");

  return formatSections(locale, [
    [copy.shortAnswer, answer || fallback.next],
    [copy.whyItMatters, copy.petKeywords[topic ?? "general"]],
    [copy.watch, watch || fallback.watch],
    [copy.nextStep, next || fallback.next],
    [copy.contactVet, vet || fallback.vet],
  ]);
}
