import React from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck, FileText, Image, File } from 'lucide-react';

interface Attachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    senderId: string;
    createdAt: Date;
    status?: 'sent' | 'delivered' | 'read';
    attachments?: Attachment[];
  };
  isCurrentUser: boolean;
}

export default function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  const getStatusIcon = () => {
    if (!isCurrentUser) return null;
    
    switch (message.status) {
      case 'read':
        return <CheckCheck className="h-4 w-4 text-blue-500" />;
      case 'delivered':
        return <CheckCheck className="h-4 w-4 text-gray-400" />;
      case 'sent':
      default:
        return <Check className="h-4 w-4 text-gray-400" />;
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="h-5 w-5" />;
    }
    if (type.includes('pdf')) {
      return <FileText className="h-5 w-5" />;
    }
    return <File className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isCurrentUser
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {message.text && <p className="text-sm">{message.text}</p>}

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center p-2 rounded ${
                  isCurrentUser ? 'bg-indigo-700' : 'bg-gray-200'
                }`}
              >
                {attachment.type.startsWith('image/') ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="max-w-full max-h-48 rounded"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    {getFileIcon(attachment.type)}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isCurrentUser ? 'text-white' : 'text-gray-900'
                      }`}>
                        {attachment.name}
                      </p>
                      <p className={`text-xs ${
                        isCurrentUser ? 'text-indigo-200' : 'text-gray-500'
                      }`}>
                        {formatFileSize(attachment.size)}
                      </p>
                    </div>
                  </div>
                )}
              </a>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-1 mt-1">
          <span className={`text-xs ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'}`}>
            {format(message.createdAt, 'HH:mm')}
          </span>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
}