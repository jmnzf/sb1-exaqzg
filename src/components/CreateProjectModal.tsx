import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { storage } from '../lib/storage';
import { mockContacts } from '../data/mockContacts';
import SelectSearch from './ui/SelectSearch';
import toast from 'react-hot-toast';
import type { Project } from '../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockClients = [
  { value: 'webtic', label: 'Webtic De Colombia' },
  { value: 'acme', label: 'Acme Corp' },
  { value: 'globex', label: 'Globex Corporation' },
  { value: 'initech', label: 'Initech' },
];

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [clientId, setClientId] = useState('');
  const [clientResponsible, setClientResponsible] = useState('');
  const [companyResponsible, setCompanyResponsible] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const memberOptions = mockContacts.map(contact => ({
    value: contact.id,
    label: `${contact.name} - ${contact.role}`
  }));

  const companyRepOptions = mockContacts.map(contact => ({
    value: contact.id,
    label: `${contact.name} - ${contact.role}`
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
        title,
        description,
        status: 'active',
        startDate,
        endDate,
        members: selectedMembers,
        clientResponsible,
        companyResponsible,
        clientId
      };

      storage.addProject(newProject);
      toast.success('Project created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New Project</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <SelectSearch
                label="Client"
                options={mockClients}
                value={mockClients.find(option => option.value === clientId)}
                onChange={(option) => setClientId(option?.value || '')}
                placeholder="Select client"
                required
              />

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Date
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    End Date
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <SelectSearch
                label="Team Members"
                isMulti
                options={memberOptions}
                value={memberOptions.filter(option => selectedMembers.includes(option.value))}
                onChange={(options) => setSelectedMembers(options ? options.map(opt => opt.value) : [])}
                placeholder="Select team members"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="clientResponsible" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Client Representative
                  </label>
                  <input
                    type="text"
                    id="clientResponsible"
                    value={clientResponsible}
                    onChange={(e) => setClientResponsible(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <SelectSearch
                  label="Company Representative"
                  options={companyRepOptions}
                  value={companyRepOptions.find(option => option.value === companyResponsible)}
                  onChange={(option) => setCompanyResponsible(option?.value || '')}
                  placeholder="Select a representative"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}