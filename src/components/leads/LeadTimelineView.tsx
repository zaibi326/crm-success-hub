
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface LeadTimelineViewProps {
  leads: TaxLead[];
  onLeadSelect: (lead: TaxLead) => void;
  getStatusBadge: (status: string) => string;
}

interface TimelineActivity {
  id: string;
  type: 'created' | 'updated' | 'called' | 'emailed' | 'note_added';
  title: string;
  description: string;
  timestamp: Date;
  lead: TaxLead;
  user: string;
}

export function LeadTimelineView({ leads, onLeadSelect, getStatusBadge }: LeadTimelineViewProps) {
  // Generate mock timeline activities
  const generateTimelineActivities = (): TimelineActivity[] => {
    const activities: TimelineActivity[] = [];
    
    leads.forEach((lead, index) => {
      // Lead created activity
      activities.push({
        id: `${lead.id}-created`,
        type: 'created',
        title: 'Lead Created',
        description: `New lead for ${lead.ownerName} at ${lead.propertyAddress}`,
        timestamp: new Date(Date.now() - (index * 2 + 1) * 24 * 60 * 60 * 1000), // Days ago
        lead,
        user: 'System'
      });

      // Random additional activities
      if (Math.random() > 0.5) {
        activities.push({
          id: `${lead.id}-note`,
          type: 'note_added',
          title: 'Note Added',
          description: lead.notes || 'Follow-up required',
          timestamp: new Date(Date.now() - (index * 2) * 24 * 60 * 60 * 1000),
          lead,
          user: 'John Doe'
        });
      }

      if (lead.phone && Math.random() > 0.7) {
        activities.push({
          id: `${lead.id}-called`,
          type: 'called',
          title: 'Phone Call Made',
          description: `Called ${lead.phone}`,
          timestamp: new Date(Date.now() - (index + 0.5) * 24 * 60 * 60 * 1000),
          lead,
          user: 'Jane Smith'
        });
      }
    });

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const activities = generateTimelineActivities();

  const getActivityIcon = (type: TimelineActivity['type']) => {
    switch (type) {
      case 'created': return <User className="w-4 h-4" />;
      case 'called': return <Phone className="w-4 h-4" />;
      case 'emailed': return <Mail className="w-4 h-4" />;
      case 'note_added': return <MessageSquare className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: TimelineActivity['type']) => {
    switch (type) {
      case 'created': return 'bg-blue-500';
      case 'called': return 'bg-green-500';
      case 'emailed': return 'bg-purple-500';
      case 'note_added': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 0) {
      if (diffHours === 0) return 'Just now';
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Activity Timeline
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4">
              {/* Timeline indicator */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center text-white`}>
                  {getActivityIcon(activity.type)}
                </div>
                {index < activities.length - 1 && (
                  <div className="w-0.5 h-16 bg-gray-200 mt-2" />
                )}
              </div>

              {/* Activity content */}
              <div className="flex-1 pb-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                      <Badge className={getStatusBadge(activity.lead.status)}>
                        {activity.lead.status}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {activity.user}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(activity.timestamp)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {activity.lead.ownerName}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onLeadSelect(activity.lead)}
                    className="ml-4"
                  >
                    View Lead
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
