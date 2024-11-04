import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatWidget from '../../src/components/ChatWidget';
import { AuthProvider } from '../../src/contexts/AuthContext';
import '../../src/index.css';

// Create widget container if it doesn't exist
const createWidgetContainer = () => {
  const containerId = 'support-chat-widget';
  let container = document.getElementById(containerId);
  
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }
  
  return container;
};

// Initialize widget
const initWidget = () => {
  const container = createWidgetContainer();
  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <ChatWidget />
      </AuthProvider>
    </React.StrictMode>
  );
};

// Export initialization function
(window as any).initSupportChat = initWidget;

// Auto-initialize if container exists
if (document.getElementById('support-chat-widget')) {
  initWidget();
}