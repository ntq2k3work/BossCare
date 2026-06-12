import type { AiCareSession, AiCareStore } from "./types";

function id() {
  return `ai_${Math.random().toString(36).slice(2, 10)}`;
}

export class MemoryAiCareStore implements AiCareStore {
  private sessions: AiCareSession[] = [];

  async countSessions(householdId: string, monthKey: string) {
    return this.sessions.filter((session) => session.householdId === householdId && session.createdAt.startsWith(monthKey)).length;
  }

  async saveSession(input: Omit<AiCareSession, "id" | "createdAt">) {
    const session = { ...input, id: id(), createdAt: new Date().toISOString() };
    this.sessions.push(session);
    return session;
  }
}
