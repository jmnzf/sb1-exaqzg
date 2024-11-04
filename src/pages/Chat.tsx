import React, { useState, useEffect, useCallback } from 'react';
import { Send, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { chatService } from '../services/chatService';
import ChatList from '../components/ChatList';
import ContactList from '../components/ContactList';
import PendingChatsList from '../components/PendingChatsList';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import ChatHeader from '../components/ChatHeader';
import { useChat } from '../hooks/useChat';

type TabType = 'chats' | 'contacts' | 'pending';

export default function Chat() {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('chats');
  const [currentChatParticipants, setCurrentChatParticipants] = useState<string[]>([]);

  const { messages, sendMessage, messagesEndRef } = useChat(
    selectedChat || 'no-chat',
    user!
  );

  const handleSelectContact = useCallback(async (contactId: string) => {
    if (!user) return;
    try {
      const chatId = await chatService.createChat(user, contactId);
      setSelectedChat(chatId);
      setActiveTab('chats');
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!selectedChat) return;

    const chat = chatService.getChat(selectedChat);
    if (chat) {
      setCurrentChatParticipants(chat.participants);
    }
  }, [selectedChat]);

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-7rem)] flex rounded-lg overflow-hidden bg-white shadow-lg">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex mt-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('chats')}
              className={`flex-1 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'chats'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Chats
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex-1 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'contacts'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contacts
            </button>
          </div>
        </div>
        
        {activeTab === 'chats' && (
          <ChatList
            onSelectChat={setSelectedChat}
            selectedChatId={selectedChat}
            searchTerm={searchTerm}
            showSupport={false}
          />
        )}
        {activeTab === 'pending' && (
          <PendingChatsList
            onSelectChat={setSelectedChat}
            selectedChatId={selectedChat}
            searchTerm={searchTerm}
          />
        )}
        {activeTab === 'contacts' && (
          <ContactList
            searchTerm={searchTerm}
            onSelectContact={handleSelectContact}
          />
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader 
          chatId={selectedChat || undefined}
          participants={currentChatParticipants}
          currentUserId={user.uid}
        />

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === user.uid}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          onSendMessage={sendMessage}
          disabled={!selectedChat}
        />
      </div>
    </div>
  );
}