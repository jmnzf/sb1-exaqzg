import { Timestamp } from 'firebase/firestore';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: Timestamp;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Timestamp;
  unreadCount: Record<string, number>;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'offline';
  lastSeen: Date;
}