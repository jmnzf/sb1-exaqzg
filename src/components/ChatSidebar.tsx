import React from 'react';
import { Search, MessageSquare, Users } from 'lucide-react';
import ChatList from './ChatList';

interface ChatSidebarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeTab: 'chats' | 'contacts';
  onTabChange: (tab: 'chats' | 'contacts') => void;
  contacts: Array<{
    id: string;
    name: string;
    email: string;
    status: 'online' | 'offline';
    lastSeen: Date;
  }>;
  onContactSelect: (contactId: string) => void;
}

export default function ChatSidebar({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  contacts,
  onContactSelect
}: ChatSidebarProps) {
  return (
    <div className="w-80 border-r border-gray-200 bg-gray-50">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex mt-4 border-b border-gray-200">
          <button
            onClick={() => onTabChange('chats')}
            className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'chats'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chats
          </button>
          <button
            onClick={() => onTabChange('contacts')}
            className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'contacts'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="h-4 w-4 mr-2" />
            Contacts
          </button>
        </div>
      </div>
      
      <ChatList
        contacts={contacts}
        searchTerm={searchTerm}
        onContactSelect={onContactSelect}
      />
    </div>
  );
}