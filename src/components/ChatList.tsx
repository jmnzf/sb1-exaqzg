import React, { useState, useEffect } from 'react';
import { Circle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { chatService, Chat } from '../services/chatService';
import { mockContacts } from '../data/mockContacts';
import { format } from 'date-fns';

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
  searchTerm: string;
  showSupport?: boolean;
}

export default function ChatList({
  onSelectChat,
  selectedChatId,
  searchTerm,
  showSupport = false
}: ChatListProps) {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = chatService.subscribeToChats(user.uid, (updatedChats) => {
      // Filter chats based on assignment and support status
      const filteredChats = showSupport 
        ? updatedChats 
        : updatedChats.filter(chat => 
            !chat.isSupport || 
            (chat.isSupport && chat.assignedTo === user.uid)
          );
      setChats(filteredChats);
    });

    return () => unsubscribe();
  }, [user, showSupport]);

  const getContactInfo = (participantId: string, chat: Chat) => {
    if (chat.isSupport) {
      return {
        name: `Visitor (${chat.visitorId})`,
        avatar: `https://ui-avatars.com/api/?name=V&background=random`,
        status: 'online'
      };
    }

    const contact = mockContacts.find(c => c.id === participantId);
    return {
      name: contact?.name || participantId,
      avatar: contact?.avatar || `https://ui-avatars.com/api/?name=${participantId}&background=random`,
      status: contact?.status || 'offline'
    };
  };

  const filteredChats = chats.filter(chat => {
    const otherParticipantId = chat.participants.find(p => p !== user?.uid) || '';
    const contactInfo = getContactInfo(otherParticipantId, chat);
    return contactInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!user) return null;

  return (
    <div className="flex-1 overflow-y-auto">
      {filteredChats.map((chat) => {
        const otherParticipantId = chat.participants.find(p => p !== user.uid) || '';
        const contactInfo = getContactInfo(otherParticipantId, chat);
        
        return (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full p-4 border-b border-gray-200 hover:bg-gray-100 ${
              selectedChatId === chat.id ? 'bg-gray-100' : ''
            }`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 relative">
                <img
                  className="h-10 w-10 rounded-full"
                  src={contactInfo.avatar}
                  alt={contactInfo.name}
                />
                <Circle 
                  className={`absolute -bottom-1 -right-1 h-4 w-4 ${
                    contactInfo.status === 'online' ? 'text-green-500' : 'text-gray-400'
                  }`} 
                  fill="currentColor" 
                />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {contactInfo.name}
                  </p>
                  {chat.lastMessageTime && (
                    <p className="text-xs text-gray-500">
                      {format(chat.lastMessageTime, 'HH:mm')}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                {chat.isSupport && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                    Support
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
      {filteredChats.length === 0 && (
        <div className="text-center p-4 text-gray-500">
          No chats found
        </div>
      )}
    </div>
  );
}