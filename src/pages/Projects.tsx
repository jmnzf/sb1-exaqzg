import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, CheckCircle, Clock, AlertTriangle, FolderGit2, Activity } from 'lucide-react';
import { storage } from '../lib/storage';
import { ProjectCard } from '../components/projects/ProjectCard';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import type { Project } from '../types';
import { isAfter } from 'date-fns';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadProjects = () => {
    setProjects(storage.getAllProjects());
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const getProjectStats = () => {
    const total = projects.length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const active = projects.filter(p => p.status === 'active').length;
    const inProgress = projects.filter(p => p.status === 'in-progress').length;
    const delayed = projects.filter(p => {
      if (p.status === 'completed') return false;
      return isAfter(new Date(), new Date(p.endDate));
    }).length;

    const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const activePercentage = total > 0 ? Math.round((active / total) * 100) : 0;
    const inProgressPercentage = total > 0 ? Math.round((inProgress / total) * 100) : 0;
    const delayedPercentage = total > 0 ? Math.round((delayed / total) * 100) : 0;

    return [
      {
        name: 'Total Projects',
        value: total,
        progress: '100%',
        icon: FolderGit2,
        iconBg: 'bg-blue-100 dark:bg-blue-900/20',
        iconColor: 'text-blue-600 dark:text-blue-400',
        progressColor: 'bg-blue-600 dark:bg-blue-500'
      },
      {
        name: 'Active Projects',
        value: active,
        progress: `${activePercentage}%`,
        icon: Clock,
        iconBg: 'bg-indigo-100 dark:bg-indigo-900/20',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        progressColor: 'bg-indigo-600 dark:bg-indigo-500'
      },
      {
        name: 'In Progress',
        value: inProgress,
        progress: `${inProgressPercentage}%`,
        icon: Activity,
        iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        progressColor: 'bg-yellow-600 dark:bg-yellow-500'
      },
      {
        name: 'Completed',
        value: completed,
        progress: `${completedPercentage}%`,
        icon: CheckCircle,
        iconBg: 'bg-green-100 dark:bg-green-900/20',
        iconColor: 'text-green-600 dark:text-green-400',
        progressColor: 'bg-green-600 dark:bg-green-500'
      },
      {
        name: 'Delayed',
        value: delayed,
        progress: `${delayedPercentage}%`,
        icon: AlertTriangle,
        iconBg: 'bg-red-100 dark:bg-red-900/20',
        iconColor: 'text-red-600 dark:text-red-400',
        progressColor: 'bg-red-600 dark:bg-red-500'
      }
    ];
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {getProjectStats().map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-gray-600 dark:text-gray-400">
                      Progress
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold inline-block text-gray-600 dark:text-gray-400">
                      {stat.progress}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100 dark:bg-gray-700">
                  <div
                    style={{ width: stat.progress }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${stat.progressColor} transition-all duration-500`}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search projects..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project}
            onStatusChange={loadProjects}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <FolderGit2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating a new project'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                New Project
              </button>
            </div>
          )}
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          loadProjects();
        }}
      />
    </div>
  );
}