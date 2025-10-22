import type { Child, InsertChild, ActionLog, InsertActionLog } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getChildren(): Promise<Child[]>;
  getChildById(id: string): Promise<Child | undefined>;
  createChild(child: InsertChild): Promise<Child>;
  deleteChild(id: string): Promise<void>;
  createActionLog(log: InsertActionLog): Promise<ActionLog>;
  getActionLogs(): Promise<ActionLog[]>;
}

export class MemStorage implements IStorage {
  private children: Map<string, Child>;
  private actionLogs: Map<string, ActionLog>;
  private dailyIdCounter: number;
  private lastResetDate: string;

  constructor() {
    this.children = new Map();
    this.actionLogs = new Map();
    this.dailyIdCounter = 1;
    this.lastResetDate = this.getTodayDateString();
  }

  private getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private checkAndResetDailyCounter() {
    const today = this.getTodayDateString();
    if (today !== this.lastResetDate) {
      this.dailyIdCounter = 1;
      this.lastResetDate = today;
      this.children.clear();
      this.actionLogs.clear();
    }
  }

  async getChildren(): Promise<Child[]> {
    this.checkAndResetDailyCounter();
    return Array.from(this.children.values());
  }

  async getChildById(id: string): Promise<Child | undefined> {
    this.checkAndResetDailyCounter();
    return this.children.get(id);
  }

  async createChild(insertChild: InsertChild): Promise<Child> {
    this.checkAndResetDailyCounter();
    const id = randomUUID();
    const child: Child = {
      ...insertChild,
      id,
      dailyId: this.dailyIdCounter++,
      status: "active",
      registeredAt: new Date(),
    };
    this.children.set(id, child);
    return child;
  }

  async deleteChild(id: string): Promise<void> {
    const child = this.children.get(id);
    if (child) {
      child.status = "picked_up";
      this.children.set(id, child);
    }
  }

  async createActionLog(insertLog: InsertActionLog): Promise<ActionLog> {
    const id = randomUUID();
    const log: ActionLog = {
      ...insertLog,
      id,
      timestamp: new Date(),
    };
    this.actionLogs.set(id, log);
    return log;
  }

  async getActionLogs(): Promise<ActionLog[]> {
    this.checkAndResetDailyCounter();
    return Array.from(this.actionLogs.values());
  }
}

export const storage = new MemStorage();
