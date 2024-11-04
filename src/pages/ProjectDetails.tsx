import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { storage } from '../lib/storage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import ProjectStats from '../components/ProjectStats';
import ProjectOverview from '../components/ProjectOverview';
import ProjectTasks from '../components/ProjectTasks';
import ProjectMembers from '../components/ProjectMembers';
import type { Project, Task } from '../types';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/projects');
      return;
    }

    const projects = storage.getAllProjects();
    const foundProject = projects.find(p => p.id === id);
    
    if (foundProject) {
      setProject(foundProject);
      setTasks(storage.getProjectTasks(foundProject.id));
    }
    setLoading(false);
  }, [id, navigate]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Invalid date:', dateString);
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Project not found</h2>
        <button
          onClick={() => navigate('/projects')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{project.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Created on {formatDate(project.createdAt)}
          </p>
        </div>
        <span className={`px-2 py-1 text-sm font-medium rounded-full ${
          project.status === 'active' ? 'bg-green-100 text-green-800' :
          project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {project.status}
        </span>
      </div>

      <ProjectStats endDate={project.endDate} tasks={tasks} />
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <ProjectOverview project={project} formatDate={formatDate} />
        </TabsContent>
        
        <TabsContent value="tasks">
          <ProjectTasks projectId={project.id} />
        </TabsContent>
        
        <TabsContent value="members">
          <ProjectMembers projectId={project.id} members={project.members} />
        </TabsContent>
      </Tabs>
    </div>
  );
}