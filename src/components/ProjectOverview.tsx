import React from 'react';
import { Calendar, Users, Clock, User } from 'lucide-react';
import { mockContacts } from '../data/mockContacts';
import type { Project } from '../types';

interface ProjectOverviewProps {
  project: Project;
  formatDate: (date: string | null) => string;
}

export default function ProjectOverview({ project, formatDate }: ProjectOverviewProps) {
  const getContactName = (userId: string) => {
    const contact = mockContacts.find(c => c.id === userId);
    return contact ? contact.name : userId;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
        <div className="space-y-4">
          <p className="text-gray-600">{project.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-gray-500">
              <Calendar className="h-5 w-5 mr-2" />
              <span>Start Date: {formatDate(project.startDate)}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Calendar className="h-5 w-5 mr-2" />
              <span>End Date: {formatDate(project.endDate)}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Users className="h-5 w-5 mr-2" />
              <span>{project.members.length} team members</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Clock className="h-5 w-5 mr-2" />
              <span>Status: {project.status}</span>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">Project Representatives</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-500">
                <User className="h-5 w-5 mr-2" />
                <span>Client: {project.clientResponsible}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <User className="h-5 w-5 mr-2" />
                <span>Company: {getContactName(project.companyResponsible)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center text-gray-500">
            <Clock className="h-5 w-5 mr-2" />
            <span>Last updated: {formatDate(project.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}