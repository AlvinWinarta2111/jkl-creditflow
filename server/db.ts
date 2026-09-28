import { and, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  applicationAuditEvents,
  applicationDocuments,
  creditApplications,
  InsertUser,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function listCreditApplications(input?: { search?: string; status?: string }) {
  const db = await getDb();
  if (!db) return [];
  const filters = [];
  if (input?.status) filters.push(eq(creditApplications.status, input.status as typeof creditApplications.status.enumValues[number]));
  if (input?.search) {
    filters.push(or(
      like(creditApplications.consumerName, `%${input.search}%`),
      like(creditApplications.applicationNumber, `%${input.search}%`),
      like(creditApplications.vehicleModel, `%${input.search}%`),
    ));
  }
  return db.select().from(creditApplications).where(filters.length ? and(...filters) : undefined).orderBy(desc(creditApplications.updatedAt));
}

export async function getCreditApplication(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(creditApplications).where(eq(creditApplications.id, id)).limit(1);
  return rows[0];
}

export async function createCreditApplication(values: typeof creditApplications.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(creditApplications).values(values);
  const rows = await db.select().from(creditApplications).where(eq(creditApplications.applicationNumber, values.applicationNumber)).limit(1);
  return rows[0];
}

export async function updateCreditApplicationStatus(id: number, status: typeof creditApplications.status.enumValues[number], actorId: number, note?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const current = await getCreditApplication(id);
  if (!current) return undefined;
  const updates: Partial<typeof creditApplications.$inferInsert> = { status, updatedAt: new Date() };
  if (status === "submitted") updates.submittedAt = new Date();
  if (status === "approved") updates.approvedAt = new Date();
  if (status === "disbursed") updates.disbursedAt = new Date();
  await db.update(creditApplications).set(updates).where(eq(creditApplications.id, id));
  await db.insert(applicationAuditEvents).values({ applicationId: id, actorId, action: `status_${status}`, fromStatus: current.status, toStatus: status, note });
  return getCreditApplication(id);
}

export async function listApplicationDocuments(applicationId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(applicationDocuments).where(eq(applicationDocuments.applicationId, applicationId)).orderBy(desc(applicationDocuments.uploadedAt));
}

export async function listApplicationAuditEvents(applicationId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(applicationAuditEvents).where(eq(applicationAuditEvents.applicationId, applicationId)).orderBy(desc(applicationAuditEvents.createdAt));
}
