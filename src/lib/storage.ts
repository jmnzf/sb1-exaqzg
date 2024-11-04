import mockData from '../data/mockData.json';
import { Project, Task, TaskComment } from '../types';

let data = { ...mockData };

// Helper function to generate a mock URL for attachments
const generateMockFileUrl = (fileName: string) => {
  return `https://storage.example.com/files/${fileName.replace(/\s+/g, '-')}`;
};

export const storage = {
  // Project operations
  getAllProjects: (): Project[] => {
    return data.projects.map(project => ({
      ...project,
      startDate: project.startDate || new Date().toISOString(),
      endDate: project.endDate || new Date().toISOString(),
      createdAt: project.createdAt || new Date().toISOString(),
      updatedAt: project.updatedAt || new Date().toISOString(),
      clientResponsible: project.clientResponsible || 'Unassigned',
      companyResponsible: project.companyResponsible || 'Unassigned',
      completionPassword: project.completionPassword || ''
    }));
  },

  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
    const now = new Date().toISOString();
    const newProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    };
    
    data.projects.push(newProject);
    saveData();
    
    return newProject;
  },

  updateProjectStatus: (projectId: string, status: Project['status'], password?: string): boolean => {
    const project = data.projects.find(p => p.id === projectId);
    if (project) {
      if (status === 'completed' && project.completionPassword && password !== project.completionPassword) {
        return false;
      }
      project.status = status;
      project.updatedAt = new Date().toISOString();
      saveData();
      return true;
    }
    return false;
  },

  // Task operations
  getAllTasks: (): Task[] => {
    return data.tasks.map(task => ({
      ...task,
      createdAt: task.createdAt || new Date().toISOString(),
      updatedAt: task.updatedAt || new Date().toISOString(),
      dueDate: task.dueDate || new Date().toISOString(),
      status: task.status || 'pendiente',
      attachments: task.attachments?.map(attachment => ({
        ...attachment,
        url: attachment.url || generateMockFileUrl(attachment.name)
      }))
    }));
  },

  getProjectTasks: (projectId: string): Task[] => {
    return data.tasks
      .filter(task => task.projectId === projectId)
      .map(task => ({
        ...task,
        createdAt: task.createdAt || new Date().toISOString(),
        updatedAt: task.updatedAt || new Date().toISOString(),
        dueDate: task.dueDate || new Date().toISOString(),
        status: task.status || 'pendiente',
        attachments: task.attachments?.map(attachment => ({
          ...attachment,
          url: attachment.url || generateMockFileUrl(attachment.name)
        }))
      }));
  },

  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
    const now = new Date().toISOString();
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      status: task.status || 'pendiente',
      attachments: task.attachments?.map(attachment => ({
        ...attachment,
        url: attachment.url || generateMockFileUrl(attachment.name)
      }))
    };
    
    data.tasks.push(newTask);
    saveData();
    
    return newTask;
  },

  updateTaskStatus: (taskId: string, status: Task['status']): void => {
    const task = data.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      task.updatedAt = new Date().toISOString();
      saveData();
    }
  },

  addTaskComment: async (taskId: string, comment: TaskComment): Promise<void> => {
    const task = data.tasks.find(t => t.id === taskId);
    if (task) {
      if (!task.comments) {
        task.comments = [];
      }
      task.comments.push(comment);
      task.updatedAt = new Date().toISOString();
      saveData();
    }
  }
};

function saveData() {
  localStorage.setItem('helpdesk_data', JSON.stringify(data));
}

// Load saved data if it exists
const savedData = localStorage.getItem('helpdesk_data');
if (savedData) {
  data = JSON.parse(savedData);
}