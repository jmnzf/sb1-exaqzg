import React from 'react';
import { User, Circle } from 'lucide-react';
import { mockContacts } from '../data/mockContacts';

interface ChatHeaderProps {
  chatId?: string;
  participants?: string[];
  currentUserId?: string;
}

export default function ChatHeader({ chatId, participants, currentUserId }: ChatHeaderProps) {
  const getContactInfo = () => {
    if (!participants || !currentUserId) return null;
    
    const otherParticipantId = participants.find(id => id !== currentUserId);
    if (!otherParticipantId) return null;

    return mockContacts.find(contact => contact.id === otherParticipantId);
  };

  const contact = getContactInfo();

  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center">
        {contact ? (
          <>
            <div className="flex-shrink-0 relative">
              <img
                className="h-10 w-10 rounded-full"
                src={contact.avatar}
                alt={contact.name}
              />
              <Circle 
                className={`absolute -bottom-1 -right-1 h-4 w-4 ${
                  contact.status === 'online' ? 'text-green-500' : 'text-gray-400'
                }`} 
                fill="currentColor" 
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {contact.name}
              </p>
              <p className="text-xs text-gray-500">
                {contact.status === 'online' ? 'Online' : 'Offline'}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex-shrink-0">
              <User className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                Select a contact
              </p>
              <p className="text-xs text-gray-500">
                No active chat
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}