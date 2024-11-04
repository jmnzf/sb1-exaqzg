import { useState, useEffect, useRef, useCallback } from 'react';
import { User } from 'firebase/auth';
import { chatService, Message } from '../services/chatService';

export function useChat(chatId: string, currentUser: User) {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = chatService.subscribeToMessages(chatId, (updatedMessages) => {
      setMessages(updatedMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = useCallback(async (text: string, attachments?: File[]) => {
    if (!text.trim() && (!attachments || attachments.length === 0)) return;
    
    try {
      await chatService.sendMessage(chatId, text, currentUser, attachments);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [chatId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return {
    messages,
    sendMessage,
    messagesEndRef
  };
}