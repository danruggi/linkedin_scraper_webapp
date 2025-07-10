import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Lead from schools table
export const leadsSchools = pgTable("leads_schools", {
  id: serial("id").primaryKey(),
  slug: text("slug"),
  uid: text("uid").unique(),
  user_name: text("user_name"),
  linkedin_profile_url: text("linkedin_profile_url"),
  linkedin_image_url: text("linkedin_image_url"),
  title: text("title"),
  location: text("location"),
  req_school: text("req_school"),
  req_country: text("req_country"),
  timestamp: text("timestamp"),
});

// Lead from salesnav table
export const leadsSalesnav = pgTable("leads_salesnav", {
  id: serial("id").primaryKey(),
  slug: text("slug"),
  uid: text("uid").unique(),
  user_name: text("user_name"),
  linkedin_profile_url: text("linkedin_profile_url"),
  linkedin_image_url: text("linkedin_image_url"),
  title: text("title"),
  location: text("location"),
  about: text("about"),
  headline: text("headline"),
  skills: text("skills"),
  experience: text("experience"),
  req_school: text("req_school"),
  req_country: text("req_country"),
  timestamp: text("timestamp"),
});

// Combined lead type for display
export const combinedLeadSchema = z.object({
  uid: z.string(),
  user_name: z.string().nullable(),
  title: z.string().nullable(),
  linkedin_profile_url: z.string().nullable(),
  linkedin_image_url: z.string().nullable(),
  location: z.string().nullable(),
  req_school: z.string().nullable(),
  req_country: z.string().nullable(),
  timestamp: z.string().nullable(),
  about: z.string().nullable(),
  headline: z.string().nullable(),
  skills: z.string().nullable(),
  experience: z.string().nullable(),
  source: z.enum(['schools', 'salesnav', 'both']),
  slug: z.string().nullable(),
});

export const leadsFiltersSchema = z.object({
  search: z.string().optional(),
  school: z.string().optional(),
  country: z.string().optional(),
  source: z.enum(['schools', 'salesnav', 'both']).optional(),
  sortBy: z.enum(['name', 'title', 'location', 'timestamp']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type LeadSchools = typeof leadsSchools.$inferSelect;
export type LeadSalesnav = typeof leadsSalesnav.$inferSelect;
export type CombinedLead = z.infer<typeof combinedLeadSchema>;
export type LeadsFilters = z.infer<typeof leadsFiltersSchema>;

export const insertLeadSchoolsSchema = createInsertSchema(leadsSchools);
export const insertLeadSalesnavSchema = createInsertSchema(leadsSalesnav);

export type InsertLeadSchools = z.infer<typeof insertLeadSchoolsSchema>;
export type InsertLeadSalesnav = z.infer<typeof insertLeadSalesnavSchema>;
