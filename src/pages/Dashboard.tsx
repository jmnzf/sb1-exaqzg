import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../lib/storage';
import { format } from 'date-fns';
import { 
  Clock, 
  Users, 
  Folder, 
  CheckCircle, 
  AlertTriangle,
  BarChart2,
  ListTodo,
  AlertCircle,
  CheckSquare,
  Clock8
} from 'lucide-react';
import MonthlyActivityChart from '../components/dashboard/MonthlyActivityChart';

export default function Dashboard() {
  const { user } = useAuth();
  const projects = storage.getAllProjects();
  const tasks = storage.getAllTasks();

  const projectStats = [
    { 
      title: 'Total Projects',
      value: projects.length,
      icon: Folder,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%'
    },
    {
      title: 'Active Projects',
      value: projects.filter(p => p.status === 'active').length,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+5%'
    },
    {
      title: 'Team Members',
      value: '24',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+2%'
    },
    {
      title: 'Completed Projects',
      value: projects.filter(p => p.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      change: '+8%'
    }
  ];

  const taskStats = [
    {
      title: 'Total Tasks',
      value: tasks.length,
      icon: ListTodo,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Completed Tasks',
      value: tasks.filter(t => t.status === 'completada').length,
      icon: CheckSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'In Progress',
      value: tasks.filter(t => t.status === 'en-progreso').length,
      icon: Clock8,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Pending Review',
      value: tasks.filter(t => t.status === 'en-revision').length,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const incidentStats = [
    {
      title: 'Active Incidents',
      value: '5',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      change: '-2%'
    },
    {
      title: 'Avg Resolution Time',
      value: '2.4h',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '-15%'
    },
    {
      title: 'Critical Issues',
      value: '2',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '0%'
    },
    {
      title: 'Resolved Today',
      value: '7',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+40%'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Welcome back, {user?.displayName || user?.email}
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </div>
      </div>

      {/* Project Stats */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Project Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {projectStats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className={`${stat.bgColor} dark:bg-opacity-10 p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                    {stat.change && (
                      <span className={`ml-2 text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Stats */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Task Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {taskStats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className={`${stat.bgColor} dark:bg-opacity-10 p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Stats */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Incident Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {incidentStats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className={`${stat.bgColor} dark:bg-opacity-10 p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                    {stat.change && (
                      <span className={`ml-2 text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity Chart */}
        <MonthlyActivityChart />

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                    <BarChart2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    New project created
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(Date.now() - index * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}