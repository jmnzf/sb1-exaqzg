import React from 'react';
import { Circle } from 'lucide-react';
import { mockContacts } from '../data/mockContacts';

interface ContactListProps {
  searchTerm: string;
  onSelectContact: (contactId: string) => void;
}

export default function ContactList({ searchTerm, onSelectContact }: ContactListProps) {
  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto">
      {filteredContacts.map((contact) => (
        <button
          key={contact.id}
          onClick={() => onSelectContact(contact.id)}
          className="w-full p-4 border-b border-gray-200 hover:bg-gray-100 flex items-center"
        >
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
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{contact.name}</p>
            <p className="text-sm text-gray-500 truncate">{contact.email}</p>
          </div>
        </button>
      ))}
      {filteredContacts.length === 0 && (
        <div className="text-center p-4 text-gray-500">
          No contacts found
        </div>
      )}
    </div>
  );
}