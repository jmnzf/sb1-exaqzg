import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Paperclip } from 'lucide-react';
import { storage } from '../lib/storage';
import { format, parseISO } from 'date-fns';
import TaskModal from './TaskModal';
import TaskDetailsModal from './TaskDetailsModal';
import type { Task } from '../types';

interface ProjectTasksProps {
  projectId: string;
}

export default function ProjectTasks({ projectId }: ProjectTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(storage.getProjectTasks(projectId));
  }, [projectId]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Invalid date:', dateString);
      return 'N/A';
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Task
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <li 
              key={task.id}
              onClick={() => handleTaskClick(task)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {task.title}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      task.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : task.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {task.description}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <p>Due {formatDate(task.dueDate)}</p>
                  </div>
                </div>
                {task.attachments && task.attachments.length > 0 && (
                  <div className="mt-2 flex items-center space-x-2">
                    <Paperclip className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {task.attachments.length} attachment{task.attachments.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                {task.comments && task.comments.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    {task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </li>
          ))}
          {tasks.length === 0 && (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No tasks found for this project
            </li>
          )}
        </ul>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTasks(storage.getProjectTasks(projectId));
        }}
        defaultProjectId={projectId}
      />

      {selectedTask && (
        <TaskDetailsModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          onUpdate={() => {
            setTasks(storage.getProjectTasks(projectId));
            const updatedTask = storage.getProjectTasks(projectId).find(t => t.id === selectedTask.id);
            if (updatedTask) {
              setSelectedTask(updatedTask);
            }
          }}
        />
      )}
    </div>
  );
}