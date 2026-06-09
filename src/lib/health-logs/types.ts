export type HealthLog = {
  id: string;
  petId: string;
  householdId: string;
  type: string;
  occurredAt: string;
  title: string;
  note: string | null;
  metadataJson: Record<string, unknown> | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
};

export type HealthLogInput = {
  type: string;
  occurredAt: string;
  title: string;
  note?: string | null;
  metadataJson?: Record<string, unknown> | null;
};

export interface HealthLogStore {
  petExists(householdId: string, petId: string): Promise<boolean>;
  listLogs(householdId: string, petId: string, type?: string | null): Promise<HealthLog[]>;
  createLog(householdId: string, petId: string, createdByUserId: string, input: HealthLogInput): Promise<HealthLog>;
  findLog(householdId: string, logId: string): Promise<HealthLog | null>;
  updateLog(householdId: string, logId: string, input: HealthLogInput): Promise<HealthLog | null>;
  deleteLog(householdId: string, logId: string): Promise<boolean>;
}
