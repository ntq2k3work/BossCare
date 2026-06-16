import type { PetCareTopic } from "@/lib/ai-care/guard";

export type AffiliateLinkCategory = PetCareTopic;

export type AffiliateSuggestion = {
  slug: string;
  title: string;
  description: string;
  affiliateUrl: string;
  category: AffiliateLinkCategory;
};
