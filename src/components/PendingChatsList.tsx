import React, { useState, useEffect } from 'react';
import { Circle, UserPlus } from 'lucide-react';
import { chatService } from '../services/chatService';
import { Chat } from '../services/chatService';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface PendingChatsListProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
  searchTerm: string;
}

export default function PendingChatsList({
  onSelectChat,
  selectedChatId,
  searchTerm
}: PendingChatsListProps) {
  const { user } = useAuth();
  const [pendingChats, setPendingChats] = useState<Chat[]>([]);

  useEffect(() => {
    const unsubscribe = chatService.subscribeToChats('support', (chats) => {
      // Filter only support chats that are active and unassigned
      const supportChats = chats.filter(
        chat => chat.isSupport && 
               chat.status === 'active' && 
               !chat.assignedTo
      );
      setPendingChats(supportChats);
    });

    return () => unsubscribe();
  }, []);

  const handleAssign = async (chatId: string) => {
    if (!user) return;
    
    try {
      await chatService.assignChat(chatId, user.uid);
      toast.success('Chat assigned to you');
      onSelectChat(chatId);
    } catch (error) {
      console.error('Error assigning chat:', error);
      toast.error('Failed to assign chat');
    }
  };

  const filteredChats = pendingChats.filter(chat => 
    chat.visitorId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto">
      {filteredChats.map((chat) => (
        <div
          key={chat.id}
          className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 ${
            selectedChatId === chat.id ? 'bg-gray-50' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 min-w-0">
              <div className="flex-shrink-0 relative">
                <img
                  className="h-10 w-10 rounded-full"
                  src={`https://ui-avatars.com/api/?name=V&background=random`}
                  alt={`Visitor ${chat.visitorId}`}
                />
                <Circle 
                  className="absolute -bottom-1 -right-1 h-4 w-4 text-green-500"
                  fill="currentColor"
                />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Visitor ({chat.visitorId})
                  </p>
                  {chat.lastMessageTime && (
                    <p className="text-xs text-gray-500">
                      {format(chat.lastMessageTime, 'HH:mm')}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending Support
                </span>
              </div>
            </div>
            
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => handleAssign(chat.id)}
                className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                title="Assign to me"
              >
                <UserPlus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
      {filteredChats.length === 0 && (
        <div className="text-center p-4 text-gray-500">
          No pending support chats
        </div>
      )}
    </div>
  );
}