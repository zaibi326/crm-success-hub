
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, MessageSquare, PhoneCall, PlayCircle, History, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommunicationPanelProps {
  leadId?: string;
  phoneNumber?: string;
  leadName?: string;
}

export function CommunicationPanel({ leadId, phoneNumber, leadName }: CommunicationPanelProps) {
  const [smsMessage, setSmsMessage] = useState('');
  const [callNotes, setCallNotes] = useState('');
  const { toast } = useToast();

  const handleClickToCall = () => {
    if (phoneNumber) {
      // Simulate SmrtPhone.io integration
      window.open(`tel:${phoneNumber}`, '_self');
      toast({
        title: "Initiating Call",
        description: `Calling ${leadName || phoneNumber} via SmrtPhone.io`,
      });
      
      // Log the call attempt
      logCommunication('call', `Called ${phoneNumber}`, '');
    }
  };

  const handleSendSMS = () => {
    if (smsMessage.trim() && phoneNumber) {
      // Simulate SMS sending via SmrtPhone.io
      toast({
        title: "SMS Sent",
        description: `Message sent to ${leadName || phoneNumber}`,
      });
      
      // Log the SMS
      logCommunication('sms', smsMessage, phoneNumber);
      setSmsMessage('');
    }
  };

  const logCommunication = (type: string, content: string, recipient: string) => {
    // This would integrate with your backend to log communications
    console.log('Communication logged:', { type, content, recipient, leadId, timestamp: new Date() });
  };

  const mockCallHistory = [
    { id: 1, type: 'call', date: '2024-01-15 10:30', duration: '5:23', status: 'completed' },
    { id: 2, type: 'sms', date: '2024-01-14 15:45', message: 'Following up on property inquiry', status: 'delivered' },
    { id: 3, type: 'call', date: '2024-01-13 09:15', duration: '2:45', status: 'completed' },
  ];

  const mockRecordings = [
    { id: 1, date: '2024-01-15 10:30', duration: '5:23', fileUrl: '#' },
    { id: 2, date: '2024-01-13 09:15', duration: '2:45', fileUrl: '#' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <Phone className="w-5 h-5 text-podio-primary" />
        <h3 className="text-lg font-semibold text-podio-text">Communication Center - SmrtPhone.io</h3>
      </div>
      
      <Tabs defaultValue="call" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="call">Call</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="recordings">Recordings</TabsTrigger>
        </TabsList>

        <TabsContent value="call" className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-podio-primary/5 border border-podio-border rounded-lg">
            <div>
              <p className="font-medium text-podio-text">{leadName || 'Contact'}</p>
              <p className="text-sm text-podio-text-muted">{phoneNumber || 'No phone number'}</p>
            </div>
            <Button 
              onClick={handleClickToCall}
              disabled={!phoneNumber}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <PhoneCall className="w-4 h-4 mr-2" />
              Click to Call
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-podio-text">Call Notes</label>
            <Textarea
              placeholder="Add notes about this call..."
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              rows={3}
              className="border-podio-border bg-podio-background"
            />
            <Button 
              onClick={() => {
                if (callNotes.trim()) {
                  logCommunication('call-note', callNotes, phoneNumber || '');
                  setCallNotes('');
                  toast({ title: "Notes Saved", description: "Call notes have been saved." });
                }
              }}
              variant="outline"
              size="sm"
              className="border-podio-border"
            >
              Save Notes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-podio-text">Send SMS to {phoneNumber}</label>
              <Textarea
                placeholder="Type your message..."
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                rows={4}
                className="border-podio-border bg-podio-background"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-podio-text-muted">{smsMessage.length}/160 characters</span>
              <Button 
                onClick={handleSendSMS}
                disabled={!smsMessage.trim() || !phoneNumber}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Send SMS
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-3">
            {mockCallHistory.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 border border-podio-border rounded-lg">
                <div className="flex items-center gap-3">
                  {record.type === 'call' ? (
                    <Phone className="w-4 h-4 text-green-600" />
                  ) : (
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  )}
                  <div>
                    <p className="font-medium text-podio-text">
                      {record.type === 'call' ? 'Phone Call' : 'SMS Message'}
                    </p>
                    <p className="text-sm text-podio-text-muted">{record.date}</p>
                    {record.duration && (
                      <p className="text-sm text-podio-text-muted">Duration: {record.duration}</p>
                    )}
                    {record.message && (
                      <p className="text-sm text-podio-text">"{record.message}"</p>
                    )}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  record.status === 'completed' || record.status === 'delivered' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recordings" className="space-y-4">
          <div className="space-y-3">
            {mockRecordings.map((recording) => (
              <div key={recording.id} className="flex items-center justify-between p-3 border border-podio-border rounded-lg">
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-podio-text">Call Recording</p>
                    <p className="text-sm text-podio-text-muted">{recording.date}</p>
                    <p className="text-sm text-podio-text-muted">Duration: {recording.duration}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-podio-border">
                  <PlayCircle className="w-4 h-4 mr-1" />
                  Play
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
