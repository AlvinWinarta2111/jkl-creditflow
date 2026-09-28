import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "marketing", "supervisor", "backoffice"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const creditApplications = mysqlTable("creditApplications", {
  id: int("id").autoincrement().primaryKey(),
  applicationNumber: varchar("applicationNumber", { length: 32 }).notNull().unique(),
  status: mysqlEnum("status", ["draft", "submitted", "approved", "docs_generated", "signed_uploaded", "disbursed", "rejected"]).default("draft").notNull(),
  consumerName: varchar("consumerName", { length: 160 }).notNull(),
  nik: varchar("nik", { length: 32 }).notNull(),
  dateOfBirth: varchar("dateOfBirth", { length: 16 }),
  maritalStatus: varchar("maritalStatus", { length: 32 }),
  spouseName: varchar("spouseName", { length: 160 }),
  dealer: varchar("dealer", { length: 160 }).notNull(),
  vehicleBrand: varchar("vehicleBrand", { length: 80 }).notNull(),
  vehicleModel: varchar("vehicleModel", { length: 120 }).notNull(),
  vehicleType: varchar("vehicleType", { length: 80 }),
  vehicleColor: varchar("vehicleColor", { length: 48 }),
  vehiclePrice: decimal("vehiclePrice", { precision: 14, scale: 2 }).notNull(),
  downPayment: decimal("downPayment", { precision: 14, scale: 2 }),
  tenorMonths: int("tenorMonths").notNull(),
  monthlyInstallment: decimal("monthlyInstallment", { precision: 14, scale: 2 }),
  insurance: varchar("insurance", { length: 100 }),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  submittedAt: timestamp("submittedAt"),
  approvedAt: timestamp("approvedAt"),
  disbursedAt: timestamp("disbursedAt"),
});

export const applicationDocuments = mysqlTable("applicationDocuments", {
  id: int("id").autoincrement().primaryKey(),
  applicationId: int("applicationId").notNull(),
  documentType: mysqlEnum("documentType", ["ktp", "kk", "spk", "proof_of_down_payment", "application_form", "contract", "po", "signed_contract", "signed_po"]).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 100 }).notNull(),
  fileKey: text("fileKey").notNull(),
  fileSize: int("fileSize"),
  verificationStatus: mysqlEnum("verificationStatus", ["pending", "verified", "rejected"]).default("pending").notNull(),
  uploadedBy: int("uploadedBy"),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  verifiedAt: timestamp("verifiedAt"),
});

export const applicationAuditEvents = mysqlTable("applicationAuditEvents", {
  id: int("id").autoincrement().primaryKey(),
  applicationId: int("applicationId").notNull(),
  actorId: int("actorId"),
  action: varchar("action", { length: 80 }).notNull(),
  fromStatus: varchar("fromStatus", { length: 40 }),
  toStatus: varchar("toStatus", { length: 40 }),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type CreditApplication = typeof creditApplications.$inferSelect;
export type InsertCreditApplication = typeof creditApplications.$inferInsert;
export type ApplicationDocument = typeof applicationDocuments.$inferSelect;
export type ApplicationAuditEvent = typeof applicationAuditEvents.$inferSelect;
