import { User } from 'firebase/auth';
import { mockContacts } from '../data/mockContacts';

export interface Message {
  id: string;
  chatId: string;
  text: string;
  senderId: string;
  senderName: string;
  createdAt: Date;
  status: 'sent' | 'delivered' | 'read';
  isVisitor?: boolean;
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Date;
  createdAt: Date;
  isSupport?: boolean;
  visitorId?: string;
  status: 'active' | 'closed';
  assignedTo?: string;
}

// Mock storage
const storage = {
  chats: [] as Chat[],
  messages: [] as Message[],
  save() {
    localStorage.setItem('chat_data', JSON.stringify({
      chats: this.chats,
      messages: this.messages
    }));
  },
  load() {
    const data = localStorage.getItem('chat_data');
    if (data) {
      const parsed = JSON.parse(data);
      this.chats = parsed.chats.map((chat: any) => ({
        ...chat,
        lastMessageTime: new Date(chat.lastMessageTime),
        createdAt: new Date(chat.createdAt)
      }));
      this.messages = parsed.messages.map((msg: any) => ({
        ...msg,
        createdAt: new Date(msg.createdAt)
      }));
    }
  }
};

// Load initial data
storage.load();

export const chatService = {
  getChat(chatId: string): Chat | undefined {
    return storage.chats.find(chat => chat.id === chatId);
  },

  async assignChat(chatId: string, userId: string): Promise<void> {
    const chat = storage.chats.find(c => c.id === chatId);
    if (!chat) throw new Error('Chat not found');

    chat.assignedTo = userId;
    // Add the support agent to the participants
    if (!chat.participants.includes(userId)) {
      chat.participants.push(userId);
    }

    // Add system message about assignment
    const systemMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      text: 'Support agent has joined the chat',
      senderId: 'system',
      senderName: 'System',
      createdAt: new Date(),
      status: 'sent'
    };

    storage.messages.push(systemMessage);
    storage.save();
  },

  async createSupportChat(visitorId: string): Promise<string> {
    // Check if visitor already has an active chat
    const existingChat = storage.chats.find(chat => 
      chat.isSupport && 
      chat.visitorId === visitorId &&
      chat.status === 'active'
    );

    if (existingChat) {
      return existingChat.id;
    }

    const chatId = `support-${Date.now()}`;
    const newChat: Chat = {
      id: chatId,
      participants: [visitorId, 'support'],
      lastMessage: '',
      lastMessageTime: new Date(),
      createdAt: new Date(),
      isSupport: true,
      visitorId,
      status: 'active'
    };
    
    storage.chats.push(newChat);
    storage.save();

    // Add welcome message
    this.sendMessage(
      chatId,
      "Welcome to our support chat! How can we help you today?",
      { uid: 'support', email: 'support@helpdesk.com' } as any
    );

    return chatId;
  },

  async createChat(currentUser: User, otherUserId: string): Promise<string> {
    // Check if chat already exists
    const existingChat = storage.chats.find(chat => 
      chat.participants.includes(currentUser.uid) && 
      chat.participants.includes(otherUserId)
    );

    if (existingChat) {
      return existingChat.id;
    }

    const chatId = `chat-${Date.now()}`;
    const newChat: Chat = {
      id: chatId,
      participants: [currentUser.uid, otherUserId],
      lastMessage: '',
      lastMessageTime: new Date(),
      createdAt: new Date(),
      status: 'active'
    };
    
    storage.chats.push(newChat);
    storage.save();
    return chatId;
  },

  async sendMessage(
    chatId: string, 
    text: string, 
    sender: User, 
    attachments?: File[]
  ): Promise<void> {
    const chat = this.getChat(chatId);
    if (!chat) throw new Error('Chat not found');

    // Process attachments (mock implementation)
    const processedAttachments = attachments?.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      size: file.size
    }));

    const isVisitor = chat.isSupport && sender.uid === chat.visitorId;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      text,
      senderId: sender.uid,
      senderName: sender.email || 'Anonymous',
      createdAt: new Date(),
      status: 'sent',
      isVisitor,
      attachments: processedAttachments
    };

    storage.messages.push(newMessage);
    
    // Update last message in chat
    chat.lastMessage = text || 'Sent an attachment';
    chat.lastMessageTime = new Date();

    storage.save();

    // Simulate message being delivered and read
    setTimeout(() => {
      newMessage.status = 'delivered';
      storage.save();
    }, 1000);

    setTimeout(() => {
      newMessage.status = 'read';
      storage.save();
    }, 3000);
  },

  subscribeToMessages(chatId: string, callback: (messages: Message[]) => void) {
    // Initial callback with existing messages
    const updateCallback = () => {
      const chatMessages = storage.messages
        .filter(m => m.chatId === chatId)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      callback(chatMessages);
    };

    updateCallback();
    
    // Set up interval to check for new messages
    const interval = setInterval(updateCallback, 1000);

    return () => clearInterval(interval);
  },

  subscribeToChats(userId: string, callback: (chats: Chat[]) => void) {
    // Initial callback with existing chats
    const updateCallback = () => {
      const userChats = storage.chats
        .filter(chat => 
          chat.participants.includes(userId) || 
          (chat.isSupport && userId === 'support' && !chat.assignedTo) ||
          chat.assignedTo === userId
        )
        .sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
      callback(userChats);
    };

    updateCallback();
    
    // Set up interval to check for new chats
    const interval = setInterval(updateCallback, 1000);

    return () => clearInterval(interval);
  }
};