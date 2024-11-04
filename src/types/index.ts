import React from 'react';

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  members: string[];
  clientId: string;
  clientName: string;
  clientResponsible: string;
  companyResponsible: string;
  completionPassword: string; // Added this field
}

export interface TaskAttachment {
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface TaskComment {
  text: string;
  userId: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'pendiente' | 'en-progreso' | 'en-revision' | 'completada';
  assignedTo: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
}