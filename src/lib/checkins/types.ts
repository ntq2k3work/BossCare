export type MediaInput = {
  storageKey: string;
  mimeType: string;
  byteSize: number;
};

export type MediaAsset = MediaInput & {
  id: string;
  householdId: string;
  petId: string | null;
  checkInId: string | null;
  createdByUserId: string;
  createdAt: string;
};

export type CheckIn = {
  id: string;
  petId: string;
  householdId: string;
  occurredAt: string;
  mood: string | null;
  note: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  mediaAssets: MediaAsset[];
};

export type CheckInInput = {
  occurredAt: string;
  mood?: string | null;
  note?: string | null;
  media?: MediaInput | null;
};

export interface CheckInStore {
  petExists(householdId: string, petId: string): Promise<boolean>;
  currentMediaBytes(householdId: string): Promise<number>;
  listCheckIns(householdId: string, petId: string): Promise<CheckIn[]>;
  createCheckIn(householdId: string, petId: string, createdByUserId: string, input: CheckInInput): Promise<CheckIn>;
}
