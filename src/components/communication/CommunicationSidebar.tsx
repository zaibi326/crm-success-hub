
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageSquare, Clock, Play, ChevronRight, X } from 'lucide-react';

interface CommunicationLog {
  id: string;
  type: 'call' | 'sms';
  phoneNumber: string;
  leadName: string;
  timestamp: Date;
  duration?: number;
  content?: string;
  recordingUrl?: string;
  status: 'completed' | 'missed' | 'failed';
}

interface CommunicationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  leadId?: string;
}

export function CommunicationSidebar({ isOpen, onClose, leadId }: CommunicationSidebarProps) {
  const [logs] = useState<CommunicationLog[]>([
    {
      id: '1',
      type: 'call',
      phoneNumber: '+1234567890',
      leadName: 'John Smith',
      timestamp: new Date(Date.now() - 3600000),
      duration: 180,
      status: 'completed',
      recordingUrl: 'https://example.com/recording1.mp3'
    },
    {
      id: '2',
      type: 'sms',
      phoneNumber: '+1234567890',
      leadName: 'John Smith',
      timestamp: new Date(Date.now() - 1800000),
      content: 'Thanks for your interest in our property...',
      status: 'completed'
    },
    {
      id: '3',
      type: 'call',
      phoneNumber: '+0987654321',
      leadName: 'Jane Doe',
      timestamp: new Date(Date.now() - 900000),
      status: 'missed'
    }
  ]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'missed': return 'bg-red-100 text-red-800';
      case 'failed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-40 border-l">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Communication Log</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {logs.map((log) => (
            <Card key={log.id} className="hover:bg-gray-50">
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      log.type === 'call' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {log.type === 'call' ? (
                        <Phone className="w-4 h-4 text-green-600" />
                      ) : (
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium text-sm">{log.leadName}</div>
                      <div className="text-xs text-gray-500">{log.phoneNumber}</div>
                      
                      {log.type === 'call' && log.duration && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(log.duration)}
                        </div>
                      )}
                      
                      {log.type === 'sms' && log.content && (
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {log.content}
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-400 mt-1">
                        {log.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                    
                    {log.recordingUrl && (
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Play className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
