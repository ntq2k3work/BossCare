import { vaccinationStatus } from "./status";
import type { VaccinationInput, VaccinationRecord, VaccinationStore } from "./types";

function id() {
  return `vax_${Math.random().toString(36).slice(2, 10)}`;
}

function now() {
  return new Date().toISOString();
}

function withStatus(record: Omit<VaccinationRecord, "status">, today: Date): VaccinationRecord {
  return {
    ...record,
    status: vaccinationStatus(record.nextDueAt, today),
  };
}

export class MemoryVaccinationStore implements VaccinationStore {
  private records = new Map<string, Omit<VaccinationRecord, "status">>();
  private householdPets = new Map<string, Set<string>>();

  registerPet(householdId: string, petId: string) {
    const set = this.householdPets.get(householdId) ?? new Set<string>();
    set.add(petId);
    this.householdPets.set(householdId, set);
  }

  async petExists(householdId: string, petId: string) {
    if (this.householdPets.get(householdId)?.has(petId)) {
      return true;
    }

    return [...this.records.values()].some((record) => record.householdId === householdId && record.petId === petId);
  }

  async listRecords(householdId: string, petId: string, today: Date) {
    return [...this.records.values()]
      .filter((record) => record.householdId === householdId && record.petId === petId)
      .sort((a, b) => (a.nextDueAt ?? "9999-12-31").localeCompare(b.nextDueAt ?? "9999-12-31"))
      .map((record) => withStatus(record, today));
  }

  async createRecord(householdId: string, petId: string, input: VaccinationInput, today: Date) {
    this.registerPet(householdId, petId);
    const timestamp = now();
    const record = {
      id: id(),
      petId,
      householdId,
      vaccineName: input.vaccineName,
      givenAt: input.givenAt,
      nextDueAt: input.nextDueAt ?? null,
      clinicName: input.clinicName ?? null,
      note: input.note ?? null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.records.set(record.id, record);
    return withStatus(record, today);
  }

  async findRecord(householdId: string, recordId: string, today: Date) {
    const record = this.records.get(recordId);
    return record?.householdId === householdId ? withStatus(record, today) : null;
  }

  async updateRecord(householdId: string, recordId: string, input: VaccinationInput, today: Date) {
    const record = await this.findRecord(householdId, recordId, today);
    if (!record) {
      return null;
    }

    const updated = {
      ...record,
      vaccineName: input.vaccineName,
      givenAt: input.givenAt,
      nextDueAt: input.nextDueAt ?? null,
      clinicName: input.clinicName ?? null,
      note: input.note ?? null,
      updatedAt: now(),
    };
    this.records.set(recordId, updated);
    return withStatus(updated, today);
  }
}
