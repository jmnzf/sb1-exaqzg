import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, X, Minus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../hooks/useChat';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { chatService } from '../services/chatService';

// Simulate an external website visitor
const generateVisitorId = () => {
  const storedId = localStorage.getItem('visitor_id');
  if (storedId) return storedId;
  
  const newId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('visitor_id', newId);
  return newId;
};

export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const visitorId = generateVisitorId();

  const initChat = useCallback(async () => {
    try {
      const sessionId = await chatService.createSupportChat(visitorId);
      setChatId(sessionId);
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  }, [visitorId]);

  useEffect(() => {
    if (!chatId) {
      initChat();
    }
  }, [chatId, initChat]);

  const { messages, sendMessage, messagesEndRef } = useChat(
    chatId || 'loading',
    { uid: visitorId, email: `visitor-${visitorId}@external.com` } as any
  );

  const handleSendMessage = async (text: string) => {
    if (!chatId) return;
    await sendMessage(text);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 transition-colors"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      ) : (
        <div className={`bg-white rounded-lg shadow-xl w-80 ${isMinimized ? 'h-12' : 'h-96'} flex flex-col`}>
          {/* Header */}
          <div className="p-3 bg-indigo-600 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Support Chat</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-indigo-700 rounded"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-indigo-700 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto bg-gray-50">
                {messages.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">Welcome to our support chat!</p>
                    <p className="text-xs mt-1">How can we help you today?</p>
                  </div>
                ) : (
                  <ChatMessages
                    messages={messages}
                    currentUserId={visitorId}
                    messagesEndRef={messagesEndRef}
                  />
                )}
              </div>
              <ChatInput onSendMessage={handleSendMessage} />
            </>
          )}
        </div>
      )}
    </div>
  );
}