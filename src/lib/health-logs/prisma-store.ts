import { getPrisma } from "@/lib/db/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { HealthLog, HealthLogInput, HealthLogStore } from "./types";

function toLog(log: {
  id: string;
  petId: string;
  householdId: string;
  type: string;
  occurredAt: Date;
  title: string;
  note: string | null;
  metadataJson: unknown;
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
}): HealthLog {
  return {
    id: log.id,
    petId: log.petId,
    householdId: log.householdId,
    type: log.type,
    occurredAt: log.occurredAt.toISOString(),
    title: log.title,
    note: log.note,
    metadataJson: log.metadataJson && typeof log.metadataJson === "object" && !Array.isArray(log.metadataJson)
      ? (log.metadataJson as Record<string, unknown>)
      : null,
    createdByUserId: log.createdByUserId,
    createdAt: log.createdAt.toISOString(),
    updatedAt: log.updatedAt.toISOString(),
  };
}

function data(input: HealthLogInput) {
  return {
    type: input.type,
    occurredAt: new Date(input.occurredAt),
    title: input.title,
    note: input.note ?? null,
    metadataJson: input.metadataJson ? (input.metadataJson as Prisma.InputJsonValue) : Prisma.JsonNull,
  };
}

export class PrismaHealthLogStore implements HealthLogStore {
  async petExists(householdId: string, petId: string) {
    const count = await getPrisma().pet.count({ where: { id: petId, householdId } });
    return count > 0;
  }

  async listLogs(householdId: string, petId: string, type?: string | null) {
    const logs = await getPrisma().healthLog.findMany({
      where: { householdId, petId, ...(type ? { type } : {}) },
      orderBy: { occurredAt: "desc" },
    });
    return logs.map(toLog);
  }

  async createLog(householdId: string, petId: string, createdByUserId: string, input: HealthLogInput) {
    const log = await getPrisma().healthLog.create({
      data: {
        householdId,
        petId,
        createdByUserId,
        ...data(input),
      },
    });
    return toLog(log);
  }

  async findLog(householdId: string, logId: string) {
    const log = await getPrisma().healthLog.findFirst({
      where: { id: logId, householdId },
    });
    return log ? toLog(log) : null;
  }

  async updateLog(householdId: string, logId: string, input: HealthLogInput) {
    const exists = await this.findLog(householdId, logId);
    if (!exists) {
      return null;
    }

    const log = await getPrisma().healthLog.update({
      where: { id: logId },
      data: data(input),
    });
    return toLog(log);
  }

  async deleteLog(householdId: string, logId: string) {
    const exists = await this.findLog(householdId, logId);
    if (!exists) {
      return false;
    }

    await getPrisma().healthLog.delete({ where: { id: logId } });
    return true;
  }
}
