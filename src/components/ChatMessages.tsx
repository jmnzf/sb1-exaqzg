import React from 'react';
import { format } from 'date-fns';
import type { ChatMessage } from '../hooks/useChat';

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentUserId: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function ChatMessages({ messages, currentUserId, messagesEndRef }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-2 ${
              msg.senderId === currentUserId
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="text-sm">{msg.text}</p>
            <p className={`text-xs ${msg.senderId === currentUserId ? 'text-indigo-200' : 'text-gray-500'} mt-1`}>
              {format(msg.createdAt, 'HH:mm')}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}