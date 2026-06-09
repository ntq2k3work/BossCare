import type { CheckIn, CheckInInput, CheckInStore, MediaAsset } from "./types";

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function now() {
  return new Date().toISOString();
}

export class MemoryCheckInStore implements CheckInStore {
  private checkIns = new Map<string, CheckIn>();
  private householdPets = new Map<string, Set<string>>();

  registerPet(householdId: string, petId: string) {
    const set = this.householdPets.get(householdId) ?? new Set<string>();
    set.add(petId);
    this.householdPets.set(householdId, set);
  }

  async petExists(householdId: string, petId: string) {
    if (this.householdPets.get(householdId)?.has(petId)) return true;
    return [...this.checkIns.values()].some((checkIn) => checkIn.householdId === householdId && checkIn.petId === petId);
  }

  async currentMediaBytes(householdId: string) {
    return [...this.checkIns.values()]
      .filter((checkIn) => checkIn.householdId === householdId)
      .flatMap((checkIn) => checkIn.mediaAssets)
      .reduce((total, media) => total + media.byteSize, 0);
  }

  async listCheckIns(householdId: string, petId: string) {
    return [...this.checkIns.values()]
      .filter((checkIn) => checkIn.householdId === householdId && checkIn.petId === petId)
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }

  async createCheckIn(householdId: string, petId: string, createdByUserId: string, input: CheckInInput) {
    this.registerPet(householdId, petId);
    const timestamp = now();
    const checkInId = id("checkin");
    const mediaAssets: MediaAsset[] = input.media
      ? [
          {
            id: id("media"),
            householdId,
            petId,
            checkInId,
            storageKey: input.media.storageKey,
            mimeType: input.media.mimeType,
            byteSize: input.media.byteSize,
            createdByUserId,
            createdAt: timestamp,
          },
        ]
      : [];
    const checkIn: CheckIn = {
      id: checkInId,
      householdId,
      petId,
      occurredAt: input.occurredAt,
      mood: input.mood ?? null,
      note: input.note ?? null,
      createdByUserId,
      createdAt: timestamp,
      updatedAt: timestamp,
      mediaAssets,
    };
    this.checkIns.set(checkIn.id, checkIn);
    return checkIn;
  }
}
