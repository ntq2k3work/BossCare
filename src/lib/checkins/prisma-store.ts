import { getPrisma } from "@/lib/db/prisma";
import type { CheckIn, CheckInInput, CheckInStore } from "./types";

function toCheckIn(checkIn: {
  id: string;
  petId: string;
  householdId: string;
  occurredAt: Date;
  mood: string | null;
  note: string | null;
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
  mediaAssets: {
    id: string;
    householdId: string;
    petId: string | null;
    checkInId: string | null;
    storageKey: string;
    mimeType: string;
    byteSize: number;
    createdByUserId: string;
    createdAt: Date;
  }[];
}): CheckIn {
  return {
    id: checkIn.id,
    petId: checkIn.petId,
    householdId: checkIn.householdId,
    occurredAt: checkIn.occurredAt.toISOString(),
    mood: checkIn.mood,
    note: checkIn.note,
    createdByUserId: checkIn.createdByUserId,
    createdAt: checkIn.createdAt.toISOString(),
    updatedAt: checkIn.updatedAt.toISOString(),
    mediaAssets: checkIn.mediaAssets.map((media) => ({
      ...media,
      createdAt: media.createdAt.toISOString(),
    })),
  };
}

export class PrismaCheckInStore implements CheckInStore {
  async petExists(householdId: string, petId: string) {
    const count = await getPrisma().pet.count({ where: { id: petId, householdId } });
    return count > 0;
  }

  async currentMediaBytes(householdId: string) {
    const result = await getPrisma().mediaAsset.aggregate({
      where: { householdId },
      _sum: { byteSize: true },
    });
    return result._sum.byteSize ?? 0;
  }

  async listCheckIns(householdId: string, petId: string) {
    const checkIns = await getPrisma().checkIn.findMany({
      where: { householdId, petId },
      include: { mediaAssets: true },
      orderBy: { occurredAt: "desc" },
    });
    return checkIns.map(toCheckIn);
  }

  async createCheckIn(householdId: string, petId: string, createdByUserId: string, input: CheckInInput) {
    const checkIn = await getPrisma().checkIn.create({
      data: {
        householdId,
        petId,
        createdByUserId,
        occurredAt: new Date(input.occurredAt),
        mood: input.mood ?? null,
        note: input.note ?? null,
        mediaAssets: input.media
          ? {
              create: {
                householdId,
                petId,
                createdByUserId,
                storageKey: input.media.storageKey,
                mimeType: input.media.mimeType,
                byteSize: input.media.byteSize,
              },
            }
          : undefined,
      },
      include: { mediaAssets: true },
    });
    return toCheckIn(checkIn);
  }
}
