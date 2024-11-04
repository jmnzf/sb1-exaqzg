import React from 'react';
import { Clock, CheckCircle, AlertCircle, ListTodo, Trophy } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';
import { Task } from '../types';
import { mockContacts } from '../data/mockContacts';

interface ProjectStatsProps {
  endDate: string;
  tasks: Task[];
}

export default function ProjectStats({ endDate, tasks }: ProjectStatsProps) {
  const daysRemaining = differenceInDays(parseISO(endDate), new Date());
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;

  // Calculate user with most completed tasks
  const tasksByUser = tasks.reduce((acc, task) => {
    if (task.status === 'completed') {
      acc[task.assignedTo] = (acc[task.assignedTo] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topPerformer = Object.entries(tasksByUser).reduce((a, b) => 
    (a[1] > b[1] ? a : b), ['', 0]);

  const getContactName = (userId: string) => {
    const contact = mockContacts.find(c => c.id === userId);
    return contact ? contact.name : userId;
  };

  const stats = [
    {
      title: 'Days Remaining',
      value: daysRemaining > 0 ? daysRemaining : 'Overdue',
      icon: Clock,
      color: daysRemaining > 0 ? 'text-blue-500' : 'text-red-500',
      bgColor: daysRemaining > 0 ? 'bg-blue-50' : 'bg-red-50'
    },
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: ListTodo,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Completed Tasks',
      value: completedTasks,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks,
      icon: AlertCircle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Top Performer',
      value: topPerformer[1] ? `${getContactName(topPerformer[0])} (${topPerformer[1]})` : 'N/A',
      icon: Trophy,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`${stat.bgColor} p-4 rounded-lg shadow-sm`}
        >
          <div className="flex items-center">
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className={`text-lg font-semibold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}