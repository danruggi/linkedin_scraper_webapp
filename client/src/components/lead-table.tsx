import { useState } from "react";
import { ArrowUpDown, ExternalLink, GraduationCap, TrendingUp, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CombinedLead, LeadsFilters } from "@shared/schema";

interface LeadTableProps {
  leads: CombinedLead[];
  isLoading: boolean;
  onLeadClick: (lead: CombinedLead) => void;
}

export function LeadTable({ leads, isLoading, onLeadClick }: LeadTableProps) {
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'schools':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <GraduationCap className="h-3 w-3 mr-1" />
            Schools
          </Badge>
        );
      case 'salesnav':
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <TrendingUp className="h-3 w-3 mr-1" />
            Sales Nav
          </Badge>
        );
      case 'both':
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            <Layers className="h-3 w-3 mr-1" />
            Both
          </Badge>
        );
      default:
        return null;
    }
  };

  const getBorderColor = (source: string) => {
    switch (source) {
      case 'schools':
        return 'border-l-4 border-l-schools';
      case 'salesnav':
        return 'border-l-4 border-l-salesnav';
      case 'both':
        return 'border-l-4 border-l-both';
      default:
        return 'border-l-4 border-l-gray-300';
    }
  };

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return '1 day ago';
    } else {
      return `${diffDays} days ago`;
    }
  };

  if (isLoading) {
    return (
      <Card className="border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="cursor-pointer hover:text-gray-700" onClick={() => handleSort('name')}>
                <div className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:text-gray-700" onClick={() => handleSort('title')}>
                <div className="flex items-center">
                  Title
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:text-gray-700" onClick={() => handleSort('location')}>
                <div className="flex items-center">
                  Location
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>School</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="cursor-pointer hover:text-gray-700" onClick={() => handleSort('timestamp')}>
                <div className="flex items-center">
                  Added
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow
                key={lead.uid}
                className={`hover:bg-gray-50 cursor-pointer ${getBorderColor(lead.source)}`}
                onClick={() => onLeadClick(lead)}
              >
                <TableCell>
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={lead.linkedin_image_url || 'https://via.placeholder.com/40'}
                      alt={lead.user_name || 'Profile'}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {lead.user_name || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {lead.linkedin_profile_url ? (
                          <a
                            href={lead.linkedin_profile_url}
                            className="hover:text-blue-600 flex items-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            LinkedIn Profile
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        ) : (
                          'No LinkedIn URL'
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">{lead.title || 'N/A'}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">{lead.location || 'N/A'}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">{lead.req_school || 'N/A'}</div>
                </TableCell>
                <TableCell>
                  {getSourceBadge(lead.source)}
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-500">
                    {formatTimestamp(lead.timestamp)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {leads.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No leads found matching your criteria.
        </div>
      )}
    </Card>
  );
}
