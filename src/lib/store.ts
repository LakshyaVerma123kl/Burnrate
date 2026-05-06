import { AuditResult } from "./audit-engine";

// Simple in-memory store for audits when Supabase is not configured.
// In production, Supabase is the source of truth.
// This allows the full flow to work locally without any database.

interface StoredAudit {
  id: string;
  teamSize: number;
  useCase: string;
  tools: any[];
  results: AuditResult;
  createdAt: Date;
}

const store = new Map<string, StoredAudit>();

export function saveAudit(audit: Omit<StoredAudit, "createdAt">): void {
  store.set(audit.id, { ...audit, createdAt: new Date() });
}

export function getAudit(id: string): StoredAudit | undefined {
  return store.get(id);
}
