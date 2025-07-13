
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, PhoneOff, Clock, User } from 'lucide-react';

interface CallStatusPanelProps {
  isVisible: boolean;
  phoneNumber: string;
  leadName?: string;
  onEndCall: () => void;
}

export function CallStatusPanel({ isVisible, phoneNumber, leadName, onEndCall }: CallStatusPanelProps) {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    onEndCall();
    
    // Log call end
    console.log(`Call ended: ${phoneNumber}, Duration: ${callDuration}s`);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="w-80 shadow-lg border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="w-5 h-5 text-green-600" />
            {callStatus === 'ringing' && 'Calling...'}
            {callStatus === 'connected' && 'Connected'}
            {callStatus === 'ended' && 'Call Ended'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <div>
              <div className="font-medium">{leadName || 'Unknown'}</div>
              <div className="text-sm text-gray-500">{phoneNumber}</div>
            </div>
          </div>
          
          {callStatus === 'connected' && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{formatDuration(callDuration)}</span>
            </div>
          )}

          <div className="flex gap-2">
            {callStatus === 'ringing' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCallStatus('connected')}
                className="flex-1"
              >
                Answer
              </Button>
            )}
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleEndCall}
              className="flex-1"
            >
              <PhoneOff className="w-4 h-4 mr-1" />
              End Call
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
