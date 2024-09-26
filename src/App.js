// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, useLocation } from 'react-router-dom';
import { Home, Users, BookOpen, Calendar, ClipboardList, Menu as MenuIcon } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import your components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ManageStudents from './pages/ManageStudents';
import ManageClasses from './pages/ManageClass';
import ManageReports from './pages/ManageReports';
import ManageSessions from './components/ManageSessions';

const MenuItem = ({ icon: Icon, children, to, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
        isActive ? 'bg-gray-200' : ''
      } ${collapsed ? 'justify-center' : ''}`}
      title={children}
    >
      <Icon className="w-5 h-5 mr-2" />
      {!collapsed && <span>{children}</span>}
    </NavLink>
  );
};

const Sidebar = ({ collapsed, onCollapse }) => (
  <div className={`bg-white h-screen ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out`}>
    <div className="flex items-center justify-between p-4">
      {!collapsed && <h1 className="text-xl font-bold">SwiftScan Attendance</h1>}
      <button onClick={onCollapse} className="p-2 rounded-full hover:bg-gray-200">
        <MenuIcon className="w-5 h-5" />
      </button>
    </div>
    <nav>
      <MenuItem to="/dashboard" icon={Home} collapsed={collapsed}>Dashboard</MenuItem>
      <MenuItem to="/students" icon={Users} collapsed={collapsed}>Manage Students</MenuItem>
      <MenuItem to="/classes" icon={BookOpen} collapsed={collapsed}>Manage Classes</MenuItem>
      <MenuItem to="/attendance" icon={Calendar} collapsed={collapsed}>Attendance</MenuItem>
      <MenuItem to="/sessions" icon={ClipboardList} collapsed={collapsed}>Manage Sessions</MenuItem>
    </nav>
  </div>
);

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  if (!user) {
    return children;
  }

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
      <div className={`flex-1 `}>
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">SwiftScan Attendance</h1>
            <button
              onClick={logout}
              className="px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <ManageStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes"
              element={
                <ProtectedRoute>
                  <ManageClasses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <ManageReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <ManageSessions />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;