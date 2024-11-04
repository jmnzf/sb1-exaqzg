import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Search, Filter, Calendar, Paperclip, Clock, AlertCircle, CheckCircle, FolderGit2 } from 'lucide-react';
import { storage } from '../lib/storage';
import TaskModal from '../components/TaskModal';
import TaskDetailsModal from '../components/TaskDetailsModal';
import { format, parseISO, isAfter, differenceInDays } from 'date-fns';
import { mockContacts } from '../data/mockContacts';
import SelectSearch from '../components/SelectSearch';
import type { Task } from '../types';

const columns = {
  pendiente: {
    title: 'Pendiente',
    color: 'bg-gray-50 border-gray-200',
    icon: Clock,
    iconColor: 'text-gray-400'
  },
  'en-progreso': {
    title: 'En Progreso',
    color: 'bg-blue-50 border-blue-200',
    icon: Clock,
    iconColor: 'text-blue-400'
  },
  'en-revision': {
    title: 'En Revisión',
    color: 'bg-yellow-50 border-yellow-200',
    icon: AlertCircle,
    iconColor: 'text-yellow-400'
  },
  completada: {
    title: 'Completada',
    color: 'bg-green-50 border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-400'
  },
};

export default function ProjectKanban() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const projects = storage.getAllProjects();
  const projectOptions = projects.map(project => ({
    value: project.id,
    label: project.title
  }));

  const userOptions = mockContacts.map(contact => ({
    value: contact.id,
    label: contact.name
  }));

  useEffect(() => {
    let filteredTasks = storage.getAllTasks();

    if (selectedProject) {
      filteredTasks = filteredTasks.filter(task => task.projectId === selectedProject);
    }

    if (selectedUser) {
      filteredTasks = filteredTasks.filter(task => task.assignedTo === selectedUser);
    }

    if (startDate && endDate) {
      filteredTasks = filteredTasks.filter(task => {
        try {
          const taskDate = parseISO(task.dueDate);
          return isWithinInterval(taskDate, {
            start: parseISO(startDate),
            end: parseISO(endDate)
          });
        } catch (error) {
          return true;
        }
      });
    }

    setTasks(filteredTasks);
  }, [selectedProject, selectedUser, startDate, endDate]);

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    const updatedTask = {
      ...task,
      status: destination.droppableId
    };

    storage.updateTaskStatus(task.id, destination.droppableId);
    
    setTasks(prevTasks => 
      prevTasks.map(t => t.id === draggableId ? updatedTask : t)
    );
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.title : 'Unknown Project';
  };

  const getContactName = (userId: string) => {
    const contact = mockContacts.find(c => c.id === userId);
    return contact ? contact.name : userId;
  };

  const getTaskTimeStatus = (dueDate: string) => {
    const today = new Date();
    const taskDate = parseISO(dueDate);
    const isTaskOverdue = isAfter(today, taskDate);
    const daysRemaining = differenceInDays(taskDate, today);

    if (isTaskOverdue) {
      return {
        text: `${Math.abs(daysRemaining)} days overdue`,
        color: 'text-red-600 dark:text-red-400'
      };
    }

    if (daysRemaining === 0) {
      return {
        text: 'Due today',
        color: 'text-amber-600 dark:text-amber-400'
      };
    }

    if (daysRemaining === 1) {
      return {
        text: 'Due tomorrow',
        color: 'text-amber-600 dark:text-amber-400'
      };
    }

    return {
      text: `${daysRemaining} days left`,
      color: 'text-gray-600 dark:text-gray-400'
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Tablero de Tareas</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Tarea
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-sm font-medium text-gray-700">Filtros</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SelectSearch
            label="Proyecto"
            isClearable
            options={projectOptions}
            value={projectOptions.find(option => option.value === selectedProject)}
            onChange={(option) => setSelectedProject(option?.value || '')}
            placeholder="Todos los proyectos"
          />

          <SelectSearch
            label="Usuario Asignado"
            isClearable
            options={userOptions}
            value={userOptions.find(option => option.value === selectedUser)}
            onChange={(option) => setSelectedUser(option?.value || '')}
            placeholder="Todos los usuarios"
          />

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Fecha Inicio
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Fecha Fin
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(columns).map(([status, column]) => (
            <div
              key={status}
              className={`${column.color} rounded-lg border p-4`}
            >
              <div className="flex items-center gap-2 mb-4">
                <column.icon className={`h-5 w-5 ${column.iconColor}`} />
                <h3 className="font-medium text-gray-900">{column.title}</h3>
                <span className="ml-auto text-sm text-gray-500">
                  {getTasksByStatus(status).length}
                </span>
              </div>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3 min-h-[200px]"
                  >
                    {getTasksByStatus(status).map((task, index) => {
                      const timeStatus = getTaskTimeStatus(task.dueDate);
                      return (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedTask(task)}
                              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <FolderGit2 className="h-4 w-4 text-gray-400" />
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                  {getProjectName(task.projectId)}
                                </span>
                              </div>
                              
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                {task.title}
                              </h4>
                              
                              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                                {task.description}
                              </p>
                              
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={`https://ui-avatars.com/api/?name=${getContactName(task.assignedTo)}&background=random`}
                                    alt={getContactName(task.assignedTo)}
                                    className="h-6 w-6 rounded-full"
                                  />
                                  <span className="text-gray-600 dark:text-gray-300">
                                    {getContactName(task.assignedTo)}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  {task.attachments && task.attachments.length > 0 && (
                                    <div className="flex items-center text-gray-400">
                                      <Paperclip className="h-4 w-4 mr-1" />
                                      {task.attachments.length}
                                    </div>
                                  )}
                                  <div className={`flex items-center ${timeStatus.color}`}>
                                    <Clock className="h-4 w-4 mr-1" />
                                    {timeStatus.text}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTasks(storage.getAllTasks());
        }}
        defaultProjectId={selectedProject}
      />

      {selectedTask && (
        <TaskDetailsModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          onUpdate={() => {
            setTasks(storage.getAllTasks());
            const updatedTask = storage.getAllTasks().find(t => t.id === selectedTask.id);
            if (updatedTask) {
              setSelectedTask(updatedTask);
            }
          }}
        />
      )}
    </div>
  );
}