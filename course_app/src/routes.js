import React from 'react';

// Import the components (with React lazy loading)
const Dashboard = React.lazy(() => import('./views/admin/dashboard/Dashboard'));
const Categories = React.lazy(() => import('./views/admin/categories/categories'));
const Users = React.lazy(() => import('./views/admin/users/accepted'));
const Waiting = React.lazy(() => import('./views/admin/users/waiting'));
const Rejected = React.lazy(() => import('./views/admin/users/rejected'));
const Courses = React.lazy(() => import('./views/admin/cours/cours'));
const Chapters = React.lazy(() => import('./views/admin/cours/chapters/chapters'));
const Contents = React.lazy(() => import('./views/admin/cours/chapters/ContentChapter'));

// Import the PrivateRoute component
import PrivateRoute from './views/admin/PrivateRoute';
import PopupPage from './views/admin/cours/chapters/popup';

// Define the routes array
const routes = [
  { path: '/Dashboard', name: 'Dashboard', element: <PrivateRoute><Dashboard /></PrivateRoute> },
  { path: '/categories', name: 'Categories', element: <PrivateRoute><Categories /></PrivateRoute> },
  { path: '/users/accepted', name: 'accepted', element: <PrivateRoute><Users /></PrivateRoute> },
  { path: '/users/waiting', name: 'waiting', element: <PrivateRoute><Waiting /></PrivateRoute> },
  { path: '/users/rejected', name: 'rejected', element: <PrivateRoute><Rejected /></PrivateRoute> },
  { path: '/courses', name: 'Courses', element: <PrivateRoute><Courses /></PrivateRoute> },
  { path: '/Chapters', name: 'Chapters', element: <PrivateRoute><Chapters /></PrivateRoute> },
  { path: '/content', name: 'Content', element: <PrivateRoute><Contents /></PrivateRoute> },
  { path:"/popup/:elementId" , name: 'popup', element:<PrivateRoute><PopupPage /></PrivateRoute> },

];

export default routes;
