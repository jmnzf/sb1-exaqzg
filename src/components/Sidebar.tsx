import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  MessageSquare, 
  ChevronDown, 
  ChevronRight, 
  LogOut,
  LifeBuoy,
  AlertCircle,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
  const { signOut } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Projects', 'Support Cases']);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleExpand = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderNavItem = (item: any, depth = 0) => {
    const hasChildren = item.children?.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const isActive = location.pathname === item.href;
    const paddingLeft = `${depth * 1 + 0.5}rem`;

    return (
      <div key={item.name}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpand(item.name)}
            className={`w-full text-left flex items-center px-2 py-1.5 text-sm font-medium rounded-md ${
              isActive ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
            style={{ paddingLeft }}
          >
            <item.icon className="mr-2 flex-shrink-0 h-4 w-4" />
            {item.name}
            {isExpanded ? (
              <ChevronDown className="ml-auto h-4 w-4" />
            ) : (
              <ChevronRight className="ml-auto h-4 w-4" />
            )}
          </button>
        ) : (
          <Link
            to={item.href}
            className={`flex items-center px-2 py-1.5 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
            style={{ paddingLeft }}
          >
            {item.icon && <item.icon className="mr-2 flex-shrink-0 h-4 w-4" />}
            {item.name}
          </Link>
        )}
        
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {item.children.map((child: any) => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-4rem)] flex flex-col">
      <nav className="flex-1 mt-4 px-2">
        <div className="space-y-1">
          {navigation.map(item => renderNavItem(item))}
        </div>
      </nav>

      <div className="p-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-full flex items-center px-2 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md"
        >
          {isDarkMode ? (
            <Sun className="mr-2 h-4 w-4" />
          ) : (
            <Moon className="mr-2 h-4 w-4" />
          )}
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        
        <button
          onClick={handleSignOut}
          className="w-full flex items-center px-2 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}