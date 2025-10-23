import type { Child, InsertChild, ActionLog, InsertActionLog, User, InsertUser, Setting, InsertSetting } from "@shared/schema";
import { children, actionLogs, dailyCounter, users, settings } from "@shared/schema";
import { db } from "../db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  getChildren(): Promise<Child[]>;
  getChildById(id: string): Promise<Child | undefined>;
  createChild(child: InsertChild): Promise<Child>;
  deleteChild(id: string): Promise<void>;
  createActionLog(log: InsertActionLog): Promise<ActionLog>;
  getActionLogs(): Promise<ActionLog[]>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getSetting(key: string): Promise<Setting | undefined>;
  setSetting(key: string, value: string): Promise<Setting>;
  getAllSettings(): Promise<Setting[]>;
}

export class DbStorage implements IStorage {
  private getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private async incrementDailyCounter(): Promise<number> {
    const today = this.getTodayDateString();
    
    const result = await db
      .insert(dailyCounter)
      .values({
        date: today,
        counter: 1,
      })
      .onConflictDoUpdate({
        target: dailyCounter.date,
        set: { counter: sql`${dailyCounter.counter} + 1` },
      })
      .returning();

    return result[0].counter;
  }

  async getChildren(): Promise<Child[]> {
    const allChildren = await db.select().from(children).orderBy(desc(children.registeredAt));
    return allChildren;
  }

  async getChildById(id: string): Promise<Child | undefined> {
    const result = await db
      .select()
      .from(children)
      .where(eq(children.id, id))
      .limit(1);
    
    return result[0];
  }

  async createChild(insertChild: InsertChild): Promise<Child> {
    const dailyId = await this.incrementDailyCounter();
    
    const result = await db
      .insert(children)
      .values({
        name: insertChild.name,
        parentPhone: insertChild.parentPhone,
        parentPhone2: insertChild.parentPhone2 || null,
        pickupTime: insertChild.pickupTime,
        dailyId,
        status: "active",
      })
      .returning();

    return result[0];
  }

  async deleteChild(id: string): Promise<void> {
    await db
      .update(children)
      .set({ status: "picked_up" })
      .where(eq(children.id, id));
  }

  async createActionLog(insertLog: InsertActionLog): Promise<ActionLog> {
    const result = await db
      .insert(actionLogs)
      .values({
        childId: insertLog.childId,
        childName: insertLog.childName,
        actionType: insertLog.actionType,
        parentPhone: insertLog.parentPhone,
        message: insertLog.message,
      })
      .returning();

    return result[0];
  }

  async getActionLogs(): Promise<ActionLog[]> {
    const logs = await db.select().from(actionLogs).orderBy(desc(actionLogs.timestamp));
    return logs;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values({
        username: insertUser.username,
        passwordHash: insertUser.passwordHash,
      })
      .returning();

    return result[0];
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    const result = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);
    
    return result[0];
  }

  async setSetting(key: string, value: string): Promise<Setting> {
    const result = await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value, updatedAt: sql`now()` },
      })
      .returning();

    return result[0];
  }

  async getAllSettings(): Promise<Setting[]> {
    const allSettings = await db.select().from(settings);
    return allSettings;
  }
}

export const storage = new DbStorage();
