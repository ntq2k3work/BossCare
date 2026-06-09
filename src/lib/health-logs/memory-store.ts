import type { HealthLog, HealthLogInput, HealthLogStore } from "./types";

function id() {
  return `log_${Math.random().toString(36).slice(2, 10)}`;
}

function now() {
  return new Date().toISOString();
}

export class MemoryHealthLogStore implements HealthLogStore {
  private logs = new Map<string, HealthLog>();
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

    return [...this.logs.values()].some((log) => log.householdId === householdId && log.petId === petId);
  }

  async listLogs(householdId: string, petId: string, type?: string | null) {
    return [...this.logs.values()]
      .filter((log) => log.householdId === householdId && log.petId === petId && (!type || log.type === type))
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }

  async createLog(householdId: string, petId: string, createdByUserId: string, input: HealthLogInput) {
    this.registerPet(householdId, petId);
    const timestamp = now();
    const log: HealthLog = {
      id: id(),
      petId,
      householdId,
      type: input.type,
      occurredAt: input.occurredAt,
      title: input.title,
      note: input.note ?? null,
      metadataJson: input.metadataJson ?? null,
      createdByUserId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.logs.set(log.id, log);
    return log;
  }

  async findLog(householdId: string, logId: string) {
    const log = this.logs.get(logId);
    return log?.householdId === householdId ? log : null;
  }

  async updateLog(householdId: string, logId: string, input: HealthLogInput) {
    const log = await this.findLog(householdId, logId);
    if (!log) {
      return null;
    }

    const updated = {
      ...log,
      ...input,
      note: input.note ?? null,
      metadataJson: input.metadataJson ?? null,
      updatedAt: now(),
    };
    this.logs.set(logId, updated);
    return updated;
  }

  async deleteLog(householdId: string, logId: string) {
    const log = await this.findLog(householdId, logId);
    if (!log) {
      return false;
    }
    this.logs.delete(logId);
    return true;
  }
}
