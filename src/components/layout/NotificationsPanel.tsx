import React from 'react';
import { Bell, MessageSquare, AlertCircle } from 'lucide-react';
import '../../styles/notifications.css';

const mockNotifications = [
  {
    id: 1,
    type: 'message',
    title: 'New Message',
    description: 'You have a new message from John Doe',
    time: '5 min ago',
    icon: MessageSquare,
    read: false
  },
  {
    id: 2,
    type: 'alert',
    title: 'System Alert',
    description: 'Server maintenance scheduled for tonight',
    time: '1 hour ago',
    icon: AlertCircle,
    read: false
  },
  {
    id: 3,
    type: 'notification',
    title: 'Task Update',
    description: 'Project "Website Redesign" has been updated',
    time: '2 hours ago',
    icon: Bell,
    read: true
  }
];

export default function NotificationsPanel() {
  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <h3>Notifications</h3>
        <button className="mark-all-read">Mark all as read</button>
      </div>

      <div className="notifications-list">
        {mockNotifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`notification-item ${notification.read ? 'read' : ''}`}
          >
            <div className="notification-icon">
              <notification.icon />
            </div>
            <div className="notification-content">
              <div className="notification-title">{notification.title}</div>
              <div className="notification-description">{notification.description}</div>
              <div className="notification-time">{notification.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="notifications-footer">
        <button className="view-all">View all notifications</button>
      </div>
    </div>
  );
}