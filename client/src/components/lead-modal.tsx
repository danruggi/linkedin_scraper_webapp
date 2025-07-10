import { X, ExternalLink, GraduationCap, TrendingUp, Layers } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CombinedLead } from "@shared/schema";

interface LeadModalProps {
  lead: CombinedLead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadModal({ lead, isOpen, onClose }: LeadModalProps) {
  if (!lead) return null;

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'schools':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <GraduationCap className="h-3 w-3 mr-1" />
            Schools Only
          </Badge>
        );
      case 'salesnav':
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <TrendingUp className="h-3 w-3 mr-1" />
            Sales Navigator
          </Badge>
        );
      case 'both':
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            <Layers className="h-3 w-3 mr-1" />
            Both Sources
          </Badge>
        );
      default:
        return null;
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

  const parseSkills = (skills: string | null) => {
    if (!skills) return [];
    return skills.split(',').map(skill => skill.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            User Details
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <img
                    className="h-24 w-24 rounded-full mx-auto object-cover mb-4"
                    src={lead.linkedin_image_url || 'https://via.placeholder.com/96'}
                    alt={lead.user_name || 'Profile'}
                  />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {lead.user_name || 'Unknown'}
                  </h4>
                  <p className="text-gray-600 mb-4">{lead.title || 'N/A'}</p>
                  <div className="flex justify-center">
                    {getSourceBadge(lead.source)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="text-sm text-gray-900">{lead.location || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">School</dt>
                    <dd className="text-sm text-gray-900">{lead.req_school || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Country</dt>
                    <dd className="text-sm text-gray-900">{lead.req_country || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">LinkedIn</dt>
                    <dd className="text-sm">
                      {lead.linkedin_profile_url ? (
                        <a
                          href={lead.linkedin_profile_url}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Profile
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {lead.about && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{lead.about}</p>
                </CardContent>
              </Card>
            )}

            {/* Professional Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {lead.headline && (
                    <div>
                      <h6 className="text-sm font-medium text-gray-500 mb-2">Headline</h6>
                      <p className="text-sm text-gray-900">{lead.headline}</p>
                    </div>
                  )}
                  {lead.skills && (
                    <div>
                      <h6 className="text-sm font-medium text-gray-500 mb-2">Skills</h6>
                      <div className="flex flex-wrap gap-2">
                        {parseSkills(lead.skills).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            {lead.experience && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lead.experience.split(',').map((exp, index) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-4">
                        <p className="text-sm text-gray-900">{exp.trim()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Data Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(lead.source === 'schools' || lead.source === 'both') && (
                    <div className="border border-green-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <GraduationCap className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">Schools Database</span>
                      </div>
                      <p className="text-xs text-gray-600">Added: {formatTimestamp(lead.timestamp)}</p>
                      <p className="text-xs text-gray-600">ID: {lead.uid}</p>
                    </div>
                  )}
                  {(lead.source === 'salesnav' || lead.source === 'both') && (
                    <div className="border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="h-4 w-4 text-orange-600 mr-2" />
                        <span className="text-sm font-medium text-orange-800">Sales Navigator</span>
                      </div>
                      <p className="text-xs text-gray-600">Added: {formatTimestamp(lead.timestamp)}</p>
                      <p className="text-xs text-gray-600">ID: {lead.uid}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
