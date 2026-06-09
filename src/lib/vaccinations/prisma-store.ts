import { getPrisma } from "@/lib/db/prisma";
import { vaccinationStatus } from "./status";
import type { VaccinationInput, VaccinationRecord, VaccinationStore } from "./types";

function toDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function toRecord(record: {
  id: string;
  petId: string;
  householdId: string;
  vaccineName: string;
  givenAt: Date;
  nextDueAt: Date | null;
  clinicName: string | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}, today: Date): VaccinationRecord {
  const nextDueAt = record.nextDueAt?.toISOString().slice(0, 10) ?? null;
  return {
    id: record.id,
    petId: record.petId,
    householdId: record.householdId,
    vaccineName: record.vaccineName,
    givenAt: record.givenAt.toISOString().slice(0, 10),
    nextDueAt,
    clinicName: record.clinicName,
    note: record.note,
    status: vaccinationStatus(nextDueAt, today),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function data(input: VaccinationInput) {
  return {
    vaccineName: input.vaccineName,
    givenAt: toDate(input.givenAt),
    nextDueAt: input.nextDueAt ? toDate(input.nextDueAt) : null,
    clinicName: input.clinicName ?? null,
    note: input.note ?? null,
  };
}

export class PrismaVaccinationStore implements VaccinationStore {
  async petExists(householdId: string, petId: string) {
    const count = await getPrisma().pet.count({ where: { id: petId, householdId } });
    return count > 0;
  }

  async listRecords(householdId: string, petId: string, today: Date) {
    const records = await getPrisma().vaccinationRecord.findMany({
      where: { householdId, petId },
      orderBy: [{ nextDueAt: "asc" }, { givenAt: "desc" }],
    });
    return records.map((record) => toRecord(record, today));
  }

  async createRecord(householdId: string, petId: string, input: VaccinationInput, today: Date) {
    const record = await getPrisma().vaccinationRecord.create({
      data: { householdId, petId, ...data(input) },
    });
    return toRecord(record, today);
  }

  async findRecord(householdId: string, recordId: string, today: Date) {
    const record = await getPrisma().vaccinationRecord.findFirst({
      where: { id: recordId, householdId },
    });
    return record ? toRecord(record, today) : null;
  }

  async updateRecord(householdId: string, recordId: string, input: VaccinationInput, today: Date) {
    const exists = await this.findRecord(householdId, recordId, today);
    if (!exists) {
      return null;
    }

    const record = await getPrisma().vaccinationRecord.update({
      where: { id: recordId },
      data: data(input),
    });
    return toRecord(record, today);
  }
}
