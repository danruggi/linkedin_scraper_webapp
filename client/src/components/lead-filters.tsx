import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { LeadsFilters } from "@shared/schema";

interface LeadFiltersProps {
  filters: LeadsFilters;
  onFiltersChange: (filters: LeadsFilters) => void;
}

export function LeadFilters({ filters, onFiltersChange }: LeadFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');

  const { data: schools = [] } = useQuery({
    queryKey: ["/api/schools"],
    queryFn: async () => {
      const response = await fetch('/api/schools');
      if (!response.ok) {
        throw new Error('Failed to fetch schools');
      }
      return response.json();
    },
  });

  const { data: countries = [] } = useQuery({
    queryKey: ["/api/countries"],
    queryFn: async () => {
      const response = await fetch('/api/countries');
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }
      return response.json();
    },
  });

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onFiltersChange({ ...filters, search: value });
  };

  const handleSchoolChange = (value: string) => {
    onFiltersChange({ ...filters, school: value === 'all' ? undefined : value });
  };

  const handleCountryChange = (value: string) => {
    onFiltersChange({ ...filters, country: value === 'all' ? undefined : value });
  };

  const handleSourceChange = (value: string) => {
    onFiltersChange({ ...filters, source: value === 'all' ? undefined : value as any });
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search leads..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Select value={filters.school || 'all'} onValueChange={handleSchoolChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Schools" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                {schools.map((school: string) => (
                  <SelectItem key={school} value={school}>
                    {school}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.country || 'all'} onValueChange={handleCountryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country: string) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.source || 'all'} onValueChange={handleSourceChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="schools">Schools Only</SelectItem>
                <SelectItem value="salesnav">Sales Navigator Only</SelectItem>
                <SelectItem value="both">Both Sources</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
