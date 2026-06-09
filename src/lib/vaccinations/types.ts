export type VaccinationStatus = "overdue" | "upcoming" | "scheduled" | "complete";

export type VaccinationRecord = {
  id: string;
  petId: string;
  householdId: string;
  vaccineName: string;
  givenAt: string;
  nextDueAt: string | null;
  clinicName: string | null;
  note: string | null;
  status: VaccinationStatus;
  createdAt: string;
  updatedAt: string;
};

export type VaccinationInput = {
  vaccineName: string;
  givenAt: string;
  nextDueAt?: string | null;
  clinicName?: string | null;
  note?: string | null;
};

export interface VaccinationStore {
  petExists(householdId: string, petId: string): Promise<boolean>;
  listRecords(householdId: string, petId: string, today: Date): Promise<VaccinationRecord[]>;
  createRecord(householdId: string, petId: string, input: VaccinationInput, today: Date): Promise<VaccinationRecord>;
  findRecord(householdId: string, recordId: string, today: Date): Promise<VaccinationRecord | null>;
  updateRecord(householdId: string, recordId: string, input: VaccinationInput, today: Date): Promise<VaccinationRecord | null>;
}
