import React, { useState } from 'react';
import { Calendar, Users, Building2, Clock, ArrowUpRight, Briefcase, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { format, parseISO, differenceInDays, isAfter } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../lib/storage';
import toast from 'react-hot-toast';
import type { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onStatusChange?: () => void;
}

interface CompleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

function CompleteProjectModal({ isOpen, onClose, onConfirm }: CompleteProjectModalProps) {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(password);
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
              <Lock className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Complete Project
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Please enter the project completion password to mark this project as completed.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 sm:mt-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter completion password"
                required
              />
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function ProjectCard({ project, onStatusChange }: ProjectCardProps) {
  const navigate = useNavigate();
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const isOverdue = project.endDate && isAfter(new Date(), parseISO(project.endDate));

  const getStatusConfig = () => {
    if (project.status === 'completed') {
      return {
        color: 'from-emerald-500 to-green-500',
        badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
        icon: <ArrowUpRight className="h-4 w-4" />,
        label: 'Completed'
      };
    }
    
    if (isOverdue) {
      return {
        color: 'from-red-500 to-rose-500',
        badge: 'bg-red-50 text-red-700 ring-red-600/20',
        icon: <AlertCircle className="h-4 w-4" />,
        label: 'Overdue'
      };
    }

    switch (project.status) {
      case 'active':
        return {
          color: 'from-amber-500 to-yellow-500',
          badge: 'bg-amber-50 text-amber-700 ring-amber-600/20',
          icon: <Clock className="h-4 w-4" />,
          label: 'Active'
        };
      case 'on-hold':
        return {
          color: 'from-blue-500 to-indigo-500',
          badge: 'bg-blue-50 text-blue-700 ring-blue-600/20',
          icon: <Clock className="h-4 w-4" />,
          label: 'On Hold'
        };
      default:
        return {
          color: 'from-gray-500 to-gray-600',
          badge: 'bg-gray-50 text-gray-700 ring-gray-600/20',
          icon: <Clock className="h-4 w-4" />,
          label: project.status
        };
    }
  };

  const statusConfig = getStatusConfig();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Invalid date:', dateString);
      return 'N/A';
    }
  };

  const getDaysRemaining = () => {
    if (!project.endDate) return null;
    const days = differenceInDays(parseISO(project.endDate), new Date());
    if (days < 0) return `${Math.abs(days)} days overdue`;
    return `${days} days left`;
  };

  const daysRemaining = getDaysRemaining();

  const handleClick = () => {
    navigate(`/projects/${project.id}`);
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the button
    setShowCompleteModal(true);
  };

  const handleCompleteConfirm = (password: string) => {
    const success = storage.updateProjectStatus(project.id, 'completed', password);
    if (success) {
      toast.success('Project marked as completed!');
      setShowCompleteModal(false);
      if (onStatusChange) {
        onStatusChange();
      }
    } else {
      toast.error('Invalid completion password');
    }
  };

  return (
    <>
      <div 
        onClick={handleClick}
        className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
      >
        {/* Top accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${statusConfig.color}`} />

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">{project.clientName}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {project.title}
              </h3>
            </div>
            <div className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset flex items-center gap-1 ${statusConfig.badge}`}>
              {statusConfig.icon}
              {statusConfig.label}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
            {project.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Timeline</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(project.startDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Team Size</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {project.members.length} members
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <Briefcase className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Client Rep</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {project.clientResponsible}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {daysRemaining && (
                <span className={`text-sm font-medium ${
                  isOverdue
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {daysRemaining}
                </span>
              )}
              {project.status !== 'completed' && (
                <button
                  onClick={handleComplete}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-full transition-colors dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                >
                  <CheckCircle className="h-4 w-4" />
                  Complete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <CompleteProjectModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onConfirm={handleCompleteConfirm}
      />
    </>
  );
}