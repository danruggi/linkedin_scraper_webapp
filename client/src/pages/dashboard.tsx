import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadTable } from "@/components/lead-table";
import { LeadModal } from "@/components/lead-modal";
import { LeadFilters } from "@/components/lead-filters";
import { LeadStats } from "@/components/lead-stats";
import type { CombinedLead, LeadsFilters } from "@shared/schema";

export default function Dashboard() {
  const [selectedLead, setSelectedLead] = useState<CombinedLead | null>(null);
  const [filters, setFilters] = useState<LeadsFilters>({});

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["/api/leads", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
      const url = `/api/leads${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      return response.json();
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/leads/stats"],
    queryFn: async () => {
      const response = await fetch('/api/leads/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      return response.json();
    },
  });

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Title', 'Location', 'School', 'Country', 'Source', 'LinkedIn'],
      ...leads.map(lead => [
        lead.user_name || '',
        lead.title || '',
        lead.location || '',
        lead.req_school || '',
        lead.req_country || '',
        lead.source,
        lead.linkedin_profile_url || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="text-blue-600 h-6 w-6" />
                <h1 className="text-xl font-semibold text-gray-900">Lead Management</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-blue-700">
                  {stats?.totalLeads || 0} Total Leads
                </span>
              </div>
              <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Section */}
        <div className="mb-8">
          <LeadStats stats={stats} />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <LeadFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Data Table */}
        <LeadTable 
          leads={leads} 
          isLoading={isLoading}
          onLeadClick={setSelectedLead}
        />
      </main>

      {/* User Details Modal */}
      <LeadModal 
        lead={selectedLead} 
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  );
}
