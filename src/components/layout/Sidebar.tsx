import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  MessageSquare, 
  ChevronDown, 
  ChevronRight, 
  LogOut,
  LifeBuoy,
  Moon,
  Sun,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/sidebar.css';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  {
    name: 'Projects',
    icon: FolderKanban,
    children: [
      { name: 'All Projects', href: '/projects' },
      { name: 'Tasks Board', href: '/projects/tasks' },
    ],
  },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  {
    name: 'Support Cases',
    icon: LifeBuoy,
    children: [
      { name: 'All Cases', href: '/support' },
      { name: 'Incidents', href: '/support/incidents' },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [expandedItem, setExpandedItem] = useState<string | null>('Projects');

  const toggleExpand = (name: string) => {
    // If clicking the same item, toggle it
    if (expandedItem === name) {
      setExpandedItem(null);
    } else {
      // If clicking a different item, close the current one and open the new one
      setExpandedItem(name);
    }
  };

  const handleNavigation = (item: any, parentName?: string) => {
    // If the item has no children (is a direct link) and is not part of the currently expanded menu,
    // close any open submenu
    if (!item.children && (!parentName || parentName !== expandedItem)) {
      setExpandedItem(null);
    }
  };

  const renderNavItem = (item: any, depth = 0, parentName?: string) => {
    const hasChildren = item.children?.length > 0;
    const isExpanded = expandedItem === item.name;
    const isActive = location.pathname === item.href;

    return (
      <div key={item.name} className={`nav-item ${isActive ? 'active' : ''}`}>
        {hasChildren ? (
          <>
            <button onClick={() => toggleExpand(item.name)}>
              <item.icon className="nav-icon" />
              {item.name}
              {isExpanded ? (
                <ChevronDown className="nav-chevron" />
              ) : (
                <ChevronRight className="nav-chevron" />
              )}
            </button>
            {isExpanded && (
              <div className="nav-children">
                {item.children.map((child: any) => renderNavItem(child, depth + 1, item.name))}
              </div>
            )}
          </>
        ) : (
          <Link 
            to={item.href} 
            onClick={() => handleNavigation(item, parentName)}
          >
            {item.icon && <item.icon className="nav-icon" />}
            {item.name}
          </Link>
        )}
      </div>
    );
  };

  return (
    <aside className={`sidebar ${isDarkMode ? 'dark' : ''}`}>
      <div className="sidebar-logo">
        <HelpCircle className="logo-icon" />
        <span className="logo-text">HelpDesk Pro</span>
      </div>
      
      <div className="sidebar-nav">
        <nav className="nav-list">
          {navigation.map(item => renderNavItem(item))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button
          onClick={toggleTheme}
          className="nav-item"
        >
          {isDarkMode ? (
            <Sun className="nav-icon" />
          ) : (
            <Moon className="nav-icon" />
          )}
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        
        <button
          onClick={signOut}
          className="nav-item"
        >
          <LogOut className="nav-icon" />
          Sign out
        </button>
      </div>
    </aside>
  );
}