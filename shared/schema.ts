import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const children = pgTable("children", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  dailyId: integer("daily_id").notNull(),
  parentPhone: text("parent_phone").notNull(),
  parentPhone2: text("parent_phone_2"),
  pickupTime: text("pickup_time").notNull(),
  status: text("status").notNull().default("active"),
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
});

export const actionLogs = pgTable("action_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  childId: varchar("child_id").notNull(),
  childName: text("child_name").notNull(),
  actionType: text("action_type").notNull(),
  parentPhone: text("parent_phone").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const dailyCounter = pgTable("daily_counter", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull().unique(),
  counter: integer("counter").notNull().default(1),
});

export const insertChildSchema = createInsertSchema(children).omit({
  id: true,
  dailyId: true,
  status: true,
  registeredAt: true,
}).extend({
  name: z.string().min(1, "Child name is required"),
  parentPhone: z.string().min(1, "Parent phone is required"),
  parentPhone2: z.string().optional(),
  pickupTime: z.string().min(1, "Pickup time is required"),
});

export const insertActionLogSchema = createInsertSchema(actionLogs).omit({
  id: true,
  timestamp: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  passwordHash: z.string(),
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export type InsertChild = z.infer<typeof insertChildSchema>;
export type Child = typeof children.$inferSelect;
export type InsertActionLog = z.infer<typeof insertActionLogSchema>;
export type ActionLog = typeof actionLogs.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Setting = typeof settings.$inferSelect;
export type DailyCounter = typeof dailyCounter.$inferSelect;
