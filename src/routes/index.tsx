import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import Projects from '../pages/Projects';
import ProjectDetails from '../pages/ProjectDetails';
import ProjectKanban from '../pages/ProjectKanban';
import Chat from '../pages/Chat';
import SupportCases from '../pages/SupportCases';
import Incidents from '../pages/Incidents';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import PrivateRoute from './PrivateRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'projects', element: <Projects /> },
          { path: 'projects/:id', element: <ProjectDetails /> },
          { path: 'projects/tasks', element: <ProjectKanban /> },
          { path: 'chat', element: <Chat /> },
          { path: 'support', element: <SupportCases /> },
          { path: 'support/incidents', element: <Incidents /> },
        ],
      },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
]);