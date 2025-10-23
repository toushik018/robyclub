import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChildSchema, insertActionLogSchema } from "@shared/schema";
import { z } from "zod";
import { getIO } from "./socket";
import { passport, hashPassword } from "./auth";

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const passwordHash = await hashPassword(password);
      const user = await storage.createUser({ username, passwordHash });
      
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to log in after registration" });
        }
        res.status(201).json({ id: user.id, username: user.username });
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: Express.User | false, info: any) => {
      if (err) {
        return res.status(500).json({ error: "Authentication failed" });
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "Invalid credentials" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ error: "Failed to log in" });
        }
        const userData = user as any;
        res.json({ id: userData.id, username: userData.username });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to log out" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      res.json({ id: user.id, username: user.username });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  app.get("/api/settings", isAuthenticated, async (_req, res) => {
    try {
      const settings = await storage.getAllSettings();
      const settingsMap: Record<string, string> = {};
      settings.forEach(s => {
        settingsMap[s.key] = s.value;
      });
      res.json(settingsMap);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings/:key", isAuthenticated, async (req, res) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      
      if (!value) {
        return res.status(400).json({ error: "Value is required" });
      }

      const setting = await storage.setSetting(key, value);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to update setting" });
    }
  });

  app.get("/api/children", isAuthenticated, async (_req, res) => {
    try {
      const children = await storage.getChildren();
      res.json(children);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch children" });
    }
  });

  app.get("/api/children/:id", isAuthenticated, async (req, res) => {
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

  app.post("/api/children", isAuthenticated, async (req, res) => {
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

  app.delete("/api/children/:id", isAuthenticated, async (req, res) => {
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

  app.post("/api/actions", isAuthenticated, async (req, res) => {
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

  app.get("/api/actions", isAuthenticated, async (_req, res) => {
    try {
      const logs = await storage.getActionLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch action logs" });
    }
  });

  app.post("/api/whatsapp", isAuthenticated, async (req, res) => {
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
  try {
    const webhookSetting = await storage.getSetting("n8n_webhook_url");
    
    if (!webhookSetting || !webhookSetting.value) {
      console.log("\n=== WhatsApp Notification (Mock - No Webhook Configured) ===");
      console.log(`To: ${phone}`);
      console.log(`Child: ${childName}`);
      console.log(`Message: ${message}`);
      console.log("Configure n8n webhook URL in Settings to enable real notifications");
      console.log("====================================\n");
      return;
    }

    const webhookUrl = webhookSetting.value;
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        message,
        childName,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error(`Failed to send WhatsApp notification: ${response.statusText}`);
    } else {
      console.log(`\n=== WhatsApp Notification Sent ===`);
      console.log(`To: ${phone}`);
      console.log(`Child: ${childName}`);
      console.log(`Message: ${message}`);
      console.log(`Webhook: ${webhookUrl}`);
      console.log("====================================\n");
    }
  } catch (error) {
    console.error("Error sending WhatsApp notification:", error);
  }
}
