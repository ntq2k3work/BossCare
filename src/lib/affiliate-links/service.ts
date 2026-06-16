import { getPrisma } from "@/lib/db/prisma";
import { DEFAULT_AFFILIATE_LINKS, type AffiliateLinkSeed } from "./defaults";
import type { AffiliateSuggestion } from "./types";

function toSuggestion(link: AffiliateLinkSeed): AffiliateSuggestion {
  return {
    slug: link.slug,
    title: link.title,
    description: link.description,
    affiliateUrl: link.affiliateUrl,
    category: link.category,
  };
}

function sortSeeds(seeds: AffiliateLinkSeed[]) {
  return [...seeds].sort((left, right) => right.priority - left.priority || right.slug.localeCompare(left.slug));
}

function fallbackSuggestions(category: AffiliateSuggestion["category"]) {
  const seeded = DEFAULT_AFFILIATE_LINKS.filter((link) => link.active && (link.category === category || link.category === "general"));
  return sortSeeds(seeded).slice(0, 3).map(toSuggestion);
}

export async function getAffiliateSuggestions(category: AffiliateSuggestion["category"] | null | undefined) {
  const normalizedCategory = category ?? "general";

  if (process.env.NODE_ENV === "test" || process.env.AUTH_STORE === "memory" || !process.env.DATABASE_URL) {
    return fallbackSuggestions(normalizedCategory);
  }

  try {
    const prisma = getPrisma();
    const rows = await prisma.affiliateLink.findMany({
      where: {
        active: true,
        category: normalizedCategory,
      },
      orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
      take: 3,
    });

    if (rows.length) {
      return rows.map((row) => ({
        slug: row.slug,
        title: row.title,
        description: row.description,
        affiliateUrl: row.affiliateUrl,
        category: row.category as AffiliateSuggestion["category"],
      }));
    }
  } catch {
    // Fall back to the baked-in links when the table is not yet available.
  }

  return fallbackSuggestions(normalizedCategory);
}
