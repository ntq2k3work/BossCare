import type { VaccinationStatus } from "./types";

function dateOnly(value: Date) {
  return Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
}

export function vaccinationStatus(nextDueAt: string | null, today = new Date()): VaccinationStatus {
  if (!nextDueAt) {
    return "complete";
  }

  const due = dateOnly(new Date(nextDueAt));
  const current = dateOnly(today);
  const daysUntilDue = Math.ceil((due - current) / 86_400_000);

  if (daysUntilDue < 0) {
    return "overdue";
  }

  if (daysUntilDue <= 30) {
    return "upcoming";
  }

  return "scheduled";
}
