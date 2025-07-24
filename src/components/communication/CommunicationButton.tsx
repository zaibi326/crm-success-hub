import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useComprehensiveActivityLogger } from '@/hooks/useComprehensiveActivityLogger';

interface CommunicationButtonProps {
  phoneNumber: string;
  leadId?: string;
  leadName?: string;
  type: 'call' | 'sms';
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  onCommunicationStart?: (type: 'call' | 'sms', phoneNumber: string) => void;
}

export function CommunicationButton({
  phoneNumber,
  leadId,
  leadName,
  type,
  size = 'sm',
  variant = 'ghost',
  onCommunicationStart
}: CommunicationButtonProps) {
  const { toast } = useToast();
  const { logCommunicationActivity } = useComprehensiveActivityLogger();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (type === 'call') {
      // Integrate with SmrtPhone.io API
      handleCall();
    } else {
      // Open SMS panel
      handleSMS();
    }
    
    onCommunicationStart?.(type, phoneNumber);
  };

  const handleCall = () => {
    // TODO: Integrate with SmrtPhone.io API
    toast({
      title: "Initiating Call",
      description: `Calling ${phoneNumber}${leadName ? ` (${leadName})` : ''}`,
    });
    
    // Log call attempt
    logCommunicationActivity(
      'call',
      `Initiated call to ${phoneNumber}${leadName ? ` (${leadName})` : ''}`,
      leadId,
      {
        phoneNumber,
        leadName,
        callStatus: 'initiated'
      }
    );
  };

  const handleSMS = () => {
    // TODO: Open SMS modal/panel
    toast({
      title: "Opening SMS",
      description: `Preparing message to ${phoneNumber}${leadName ? ` (${leadName})` : ''}`,
    });

    // Log SMS attempt
    logCommunicationActivity(
      'sms',
      `Opened SMS panel for ${phoneNumber}${leadName ? ` (${leadName})` : ''}`,
      leadId,
      {
        phoneNumber,
        leadName,
        smsStatus: 'opened'
      }
    );
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleClick}
      className={`h-8 w-8 p-0 ${
        type === 'call' 
          ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
          : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
      }`}
      title={type === 'call' ? `Call ${phoneNumber}` : `Send SMS to ${phoneNumber}`}
    >
      {type === 'call' ? (
        <Phone className="w-3 h-3" />
      ) : (
        <MessageSquare className="w-3 h-3" />
      )}
    </Button>
  );
}
