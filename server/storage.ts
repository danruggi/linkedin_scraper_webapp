import { 
  type LeadSchools, 
  type LeadSalesnav, 
  type CombinedLead, 
  type LeadsFilters,
  type InsertLeadSchools,
  type InsertLeadSalesnav 
} from "@shared/schema";

export interface IStorage {
  getLeads(filters?: LeadsFilters): Promise<CombinedLead[]>;
  getLeadByUid(uid: string): Promise<CombinedLead | undefined>;
  getLeadStats(): Promise<{
    totalLeads: number;
    schoolsOnly: number;
    salesnavOnly: number;
    both: number;
  }>;
  getUniqueSchools(): Promise<string[]>;
  getUniqueCountries(): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private leadsSchools: Map<string, LeadSchools>;
  private leadsSalesnav: Map<string, LeadSalesnav>;
  private currentId: number;

  constructor() {
    this.leadsSchools = new Map();
    this.leadsSalesnav = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Sample data for demonstration
    const schoolsData: InsertLeadSchools[] = [
      {
        uid: "uid123",
        user_name: "John Richardson",
        linkedin_profile_url: "https://linkedin.com/in/johnrichardson",
        linkedin_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        title: "Senior Marketing Director",
        location: "San Francisco, CA",
        req_school: "Stanford University",
        req_country: "United States",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        slug: "stanford-2024"
      },
      {
        uid: "uid101",
        user_name: "Emily Watson",
        linkedin_profile_url: "https://linkedin.com/in/emilywatson",
        linkedin_image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
        title: "Head of Business Development",
        location: "London, UK",
        req_school: "Oxford University",
        req_country: "United Kingdom",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        slug: "oxford-2024"
      }
    ];

    const salesnavData: InsertLeadSalesnav[] = [
      {
        uid: "uid456",
        user_name: "Sarah Chen",
        linkedin_profile_url: "https://linkedin.com/in/sarahchen",
        linkedin_image_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
        title: "VP of Product Strategy",
        location: "New York, NY",
        req_school: "Harvard Business School",
        req_country: "United States",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        slug: "harvard-2024",
        about: "Experienced product leader with 12+ years in tech strategy and innovation.",
        headline: "VP of Product Strategy at InnovateTech | Harvard MBA | Product Innovation Expert",
        skills: "Product Strategy, Innovation Management, Team Leadership, Data Analytics",
        experience: "VP Product Strategy at InnovateTech (2021-Present), Senior Product Manager at TechCorp (2018-2021)"
      },
      {
        uid: "uid789",
        user_name: "Michael Torres",
        linkedin_profile_url: "https://linkedin.com/in/michaeltorres",
        linkedin_image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        title: "Chief Technology Officer",
        location: "Austin, TX",
        req_school: "MIT",
        req_country: "United States",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        slug: "mit-2024",
        about: "Technology executive with expertise in scalable systems and team leadership.",
        headline: "CTO at ScaleTech | MIT Alum | Engineering Leadership & Architecture",
        skills: "System Architecture, Team Leadership, Cloud Computing, DevOps",
        experience: "CTO at ScaleTech (2020-Present), Senior Engineering Manager at BigTech (2017-2020)"
      },
      {
        uid: "uid112",
        user_name: "David Kim",
        linkedin_profile_url: "https://linkedin.com/in/davidkim",
        linkedin_image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
        title: "Senior Sales Director",
        location: "Toronto, Canada",
        req_school: "University of Toronto",
        req_country: "Canada",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        slug: "toronto-2024",
        about: "Sales leadership professional with proven track record in B2B enterprise sales.",
        headline: "Senior Sales Director at GrowthCorp | Enterprise Sales Expert | Revenue Growth",
        skills: "Enterprise Sales, Team Leadership, Customer Relations, Revenue Strategy",
        experience: "Senior Sales Director at GrowthCorp (2019-Present), Sales Manager at SalesForce (2016-2019)"
      }
    ];

    // Add schools data
    schoolsData.forEach(lead => {
      const id = this.currentId++;
      this.leadsSchools.set(lead.uid!, { ...lead, id });
    });

    // Add salesnav data
    salesnavData.forEach(lead => {
      const id = this.currentId++;
      this.leadsSalesnav.set(lead.uid!, { ...lead, id });
    });

    // Add one lead that exists in both (Michael Torres)
    const bothLead: InsertLeadSchools = {
      uid: "uid789",
      user_name: "Michael Torres",
      linkedin_profile_url: "https://linkedin.com/in/michaeltorres",
      linkedin_image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      title: "Chief Technology Officer",
      location: "Austin, TX",
      req_school: "MIT",
      req_country: "United States",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      slug: "mit-2024"
    };
    this.leadsSchools.set(bothLead.uid!, { ...bothLead, id: this.currentId++ });
  }

  async getLeads(filters?: LeadsFilters): Promise<CombinedLead[]> {
    const uniqueLeads = new Map<string, CombinedLead>();

    // Process schools leads
    for (const [uid, lead] of this.leadsSchools) {
      const combinedLead: CombinedLead = {
        uid,
        user_name: lead.user_name,
        title: lead.title,
        linkedin_profile_url: lead.linkedin_profile_url,
        linkedin_image_url: lead.linkedin_image_url,
        location: lead.location,
        req_school: lead.req_school,
        req_country: lead.req_country,
        timestamp: lead.timestamp,
        about: null,
        headline: null,
        skills: null,
        experience: null,
        source: 'schools' as const,
        slug: lead.slug
      };
      uniqueLeads.set(uid, combinedLead);
    }

    // Process salesnav leads
    for (const [uid, lead] of this.leadsSalesnav) {
      const existing = uniqueLeads.get(uid);
      if (existing) {
        // Lead exists in both sources
        const combinedLead: CombinedLead = {
          ...existing,
          about: lead.about,
          headline: lead.headline,
          skills: lead.skills,
          experience: lead.experience,
          source: 'both' as const
        };
        uniqueLeads.set(uid, combinedLead);
      } else {
        // Lead only in salesnav
        const combinedLead: CombinedLead = {
          uid,
          user_name: lead.user_name,
          title: lead.title,
          linkedin_profile_url: lead.linkedin_profile_url,
          linkedin_image_url: lead.linkedin_image_url,
          location: lead.location,
          req_school: lead.req_school,
          req_country: lead.req_country,
          timestamp: lead.timestamp,
          about: lead.about,
          headline: lead.headline,
          skills: lead.skills,
          experience: lead.experience,
          source: 'salesnav' as const,
          slug: lead.slug
        };
        uniqueLeads.set(uid, combinedLead);
      }
    }

    let results = Array.from(uniqueLeads.values());

    // Apply filters
    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        results = results.filter(lead => 
          lead.user_name?.toLowerCase().includes(searchLower) ||
          lead.title?.toLowerCase().includes(searchLower) ||
          lead.location?.toLowerCase().includes(searchLower) ||
          lead.req_school?.toLowerCase().includes(searchLower)
        );
      }

      if (filters.school) {
        results = results.filter(lead => 
          lead.req_school?.toLowerCase().includes(filters.school!.toLowerCase())
        );
      }

      if (filters.country) {
        results = results.filter(lead => 
          lead.req_country?.toLowerCase().includes(filters.country!.toLowerCase())
        );
      }

      if (filters.source) {
        results = results.filter(lead => lead.source === filters.source);
      }

      // Apply sorting
      if (filters.sortBy) {
        results.sort((a, b) => {
          let aVal = '';
          let bVal = '';

          switch (filters.sortBy) {
            case 'name':
              aVal = a.user_name || '';
              bVal = b.user_name || '';
              break;
            case 'title':
              aVal = a.title || '';
              bVal = b.title || '';
              break;
            case 'location':
              aVal = a.location || '';
              bVal = b.location || '';
              break;
            case 'timestamp':
              aVal = a.timestamp || '';
              bVal = b.timestamp || '';
              break;
          }

          const comparison = aVal.localeCompare(bVal);
          return filters.sortOrder === 'desc' ? -comparison : comparison;
        });
      }
    }

    return results;
  }

  async getLeadByUid(uid: string): Promise<CombinedLead | undefined> {
    const leads = await this.getLeads();
    return leads.find(lead => lead.uid === uid);
  }

  async getLeadStats(): Promise<{
    totalLeads: number;
    schoolsOnly: number;
    salesnavOnly: number;
    both: number;
  }> {
    const leads = await this.getLeads();
    const schoolsOnly = leads.filter(lead => lead.source === 'schools').length;
    const salesnavOnly = leads.filter(lead => lead.source === 'salesnav').length;
    const both = leads.filter(lead => lead.source === 'both').length;

    return {
      totalLeads: leads.length,
      schoolsOnly,
      salesnavOnly,
      both
    };
  }

  async getUniqueSchools(): Promise<string[]> {
    const leads = await this.getLeads();
    const schools = new Set<string>();
    leads.forEach(lead => {
      if (lead.req_school) {
        schools.add(lead.req_school);
      }
    });
    return Array.from(schools).sort();
  }

  async getUniqueCountries(): Promise<string[]> {
    const leads = await this.getLeads();
    const countries = new Set<string>();
    leads.forEach(lead => {
      if (lead.req_country) {
        countries.add(lead.req_country);
      }
    });
    return Array.from(countries).sort();
  }
}

export const storage = new MemStorage();
