import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { leadsFiltersSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all leads with optional filters
  app.get("/api/leads", async (req, res) => {
    try {
      const filters = leadsFiltersSchema.parse(req.query);
      const leads = await storage.getLeads(filters);
      res.json(leads);
    } catch (error) {
      res.status(400).json({ error: "Invalid filters" });
    }
  });

  // Get lead by UID
  app.get("/api/leads/:uid", async (req, res) => {
    try {
      const { uid } = req.params;
      const lead = await storage.getLeadByUid(uid);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get lead statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getLeadStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get unique schools
  app.get("/api/schools", async (req, res) => {
    try {
      const schools = await storage.getUniqueSchools();
      res.json(schools);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get unique countries
  app.get("/api/countries", async (req, res) => {
    try {
      const countries = await storage.getUniqueCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
