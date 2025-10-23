import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChildSchema, insertActionLogSchema } from "@shared/schema";
import { z } from "zod";
import { getIO } from "./socket";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/children", async (_req, res) => {
    try {
      const children = await storage.getChildren();
      res.json(children);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch children" });
    }
  });

  app.get("/api/children/:id", async (req, res) => {
    try {
      const child = await storage.getChildById(req.params.id);
      if (!child) {
        return res.status(404).json({ error: "Child not found" });
      }
      res.json(child);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch child" });
    }
  });

  app.post("/api/children", async (req, res) => {
    try {
      const validatedData = insertChildSchema.parse(req.body);
      const child = await storage.createChild(validatedData);
      
      getIO().emit("child:created", child);
      
      res.status(201).json(child);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create child" });
    }
  });

  app.delete("/api/children/:id", async (req, res) => {
    try {
      const child = await storage.getChildById(req.params.id);
      if (!child) {
        return res.status(404).json({ error: "Child not found" });
      }
      await storage.deleteChild(req.params.id);
      
      getIO().emit("child:deleted", { id: req.params.id });
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete child" });
    }
  });

  app.post("/api/actions", async (req, res) => {
    try {
      const validatedData = insertActionLogSchema.parse(req.body);
      const log = await storage.createActionLog(validatedData);
      
      await sendWhatsAppMessage(
        validatedData.parentPhone,
        validatedData.message,
        validatedData.childName
      );

      getIO().emit("action:created", log);

      res.status(201).json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create action log" });
    }
  });

  app.get("/api/actions", async (_req, res) => {
    try {
      const logs = await storage.getActionLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch action logs" });
    }
  });

  app.post("/api/whatsapp", async (req, res) => {
    try {
      const { phone, message, childName } = req.body;
      
      if (!phone || !message) {
        return res.status(400).json({ error: "Phone and message are required" });
      }

      await sendWhatsAppMessage(phone, message, childName || "Unknown");
      
      res.status(200).json({ 
        success: true, 
        message: "WhatsApp notification sent (mock)",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to send WhatsApp message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function sendWhatsAppMessage(
  phone: string,
  message: string,
  childName: string
): Promise<void> {
  console.log("\n=== WhatsApp Notification (Mock) ===");
  console.log(`To: ${phone}`);
  console.log(`Child: ${childName}`);
  console.log(`Message: ${message}`);
  console.log("====================================\n");
  
  return Promise.resolve();
}
