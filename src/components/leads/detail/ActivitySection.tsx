
import React from 'react';
import { Activity } from 'lucide-react';

interface ActivityItem {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  user: string;
}

interface ActivitySectionProps {
  activities: ActivityItem[];
}

export function ActivitySection({ activities }: ActivitySectionProps) {
  return (
    <div className="podio-container p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-podio-primary" />
        <h3 className="font-semibold text-podio-text">Lead Activity</h3>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 pb-4 border-b border-podio-border last:border-b-0">
            <div className="w-8 h-8 rounded-full bg-podio-primary/10 flex items-center justify-center flex-shrink-0">
              <Activity className="w-4 h-4 text-podio-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-podio-text">{activity.title}</h4>
                <span className="text-xs text-podio-text-muted">
                  {activity.timestamp.toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-podio-text-muted mb-1">{activity.description}</p>
              <p className="text-xs text-podio-text-muted">by {activity.user}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
