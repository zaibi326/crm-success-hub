
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, X, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SMSMessage {
  id: string;
  content: string;
  timestamp: Date;
  direction: 'incoming' | 'outgoing';
}

interface SMSPanelProps {
  isVisible: boolean;
  phoneNumber: string;
  leadName?: string;
  leadId?: string;
  onClose: () => void;
}

export function SMSPanel({ isVisible, phoneNumber, leadName, leadId, onClose }: SMSPanelProps) {
  const [messages, setMessages] = useState<SMSMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const maxLength = 160;

  useEffect(() => {
    if (isVisible) {
      // Load existing SMS history
      loadSMSHistory();
    }
  }, [isVisible, phoneNumber]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSMSHistory = async () => {
    // TODO: Load SMS history from database
    // For now, add mock data
    setMessages([
      {
        id: '1',
        content: 'Hi, I received your information about the property. Can we discuss?',
        timestamp: new Date(Date.now() - 3600000),
        direction: 'incoming'
      }
    ]);
  };

  const handleSendSMS = async () => {
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    
    try {
      // TODO: Integrate with SmrtPhone.io SMS API
      const message: SMSMessage = {
        id: Date.now().toString(),
        content: newMessage,
        timestamp: new Date(),
        direction: 'outgoing'
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');

      toast({
        title: "SMS Sent",
        description: `Message sent to ${phoneNumber}`,
      });

      // TODO: Log SMS to lead activity
      console.log(`SMS sent to ${phoneNumber}: ${newMessage}`);
      
    } catch (error) {
      toast({
        title: "Failed to send SMS",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendSMS();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 w-96">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              SMS
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <div>
              <div className="font-medium">{leadName || 'Unknown'}</div>
              <div className="text-xs">{phoneNumber}</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Messages */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                    message.direction === 'outgoing'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div>{message.content}</div>
                  <div className={`text-xs mt-1 ${
                    message.direction === 'outgoing' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="min-h-[80px] resize-none"
              maxLength={maxLength}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {newMessage.length}/{maxLength}
              </span>
              <Button
                onClick={handleSendSMS}
                disabled={!newMessage.trim() || isLoading}
                size="sm"
              >
                <Send className="w-4 h-4 mr-1" />
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
