import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  PieChart, 
  Users, 
  ClipboardList, 
  Settings, 
  Bell, 
  LogOut, 
  User,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'Your leave request has been approved',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      message: 'New company policy update',
      time: '1 day ago',
      read: true
    },
    {
      id: 3,
      message: 'Remember to submit your monthly report',
      time: '2 days ago',
      read: true
    }
  ]);
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setNotificationsOpen(false);
      setProfileOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  // Close sidebar on navigation on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
  
  // Employee navigation items
  const employeeNavItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      name: 'Apply for Leave', 
      path: '/leave/apply', 
      icon: <Calendar size={20} /> 
    },
    { 
      name: 'Leave History', 
      path: '/leave/history', 
      icon: <ClipboardList size={20} /> 
    },
    { 
      name: 'Leave Balance', 
      path: '/leave/balance', 
      icon: <Clock size={20} /> 
    }
  ];
  
  // Admin navigation items
  const adminNavItems = [
    { 
      name: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      name: 'Leave Requests', 
      path: '/admin/leave-requests', 
      icon: <ClipboardList size={20} /> 
    },
    { 
      name: 'Employee Management', 
      path: '/admin/employees', 
      icon: <Users size={20} /> 
    },
    { 
      name: 'Reports', 
      path: '/admin/reports', 
      icon: <PieChart size={20} /> 
    }
  ];
  
  // Common navigation items
  const commonNavItems = [
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: <User size={20} /> 
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings size={20} /> 
    }
  ];
  
  // Navigation items based on user role
  const navItems = user?.role === 'admin' ? adminNavItems : employeeNavItems;
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Mark all notifications as read
  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  // Navigation item component
  const NavItem = ({ item }: { item: { name: string; path: string; icon: JSX.Element } }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <Link
        to={item.path}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
          isActive
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }`}
      >
        <span className={isActive ? 'text-primary-600 dark:text-primary-400' : ''}>{item.icon}</span>
        <span className="font-medium">{item.name}</span>
      </Link>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary-600 dark:text-primary-400">
            <Briefcase size={24} />
            <span>TimeOff</span>
          </Link>
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Sidebar content */}
        <div className="py-4 px-3 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="space-y-1 mb-6">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
          
          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
          
          {/* Common nav items */}
          <div className="space-y-1">
            {commonNavItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
          
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center space-x-3 px-4 py-3 mt-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'light' ? (
              <>
                <Moon size={20} />
                <span className="font-medium">Dark Mode</span>
              </>
            ) : (
              <>
                <Sun size={20} />
                <span className="font-medium">Light Mode</span>
              </>
            )}
          </button>
          
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 mt-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 transition-colors duration-200">
          {/* Mobile menu button */}
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          {/* Page title - shown on mobile only */}
          <div className="lg:hidden font-semibold text-gray-800 dark:text-gray-200">
            {location.pathname === '/dashboard' && 'Dashboard'}
            {location.pathname === '/leave/apply' && 'Apply for Leave'}
            {location.pathname === '/leave/history' && 'Leave History'}
            {location.pathname === '/leave/balance' && 'Leave Balance'}
            {location.pathname === '/admin/dashboard' && 'Admin Dashboard'}
            {location.pathname === '/admin/leave-requests' && 'Leave Requests'}
            {location.pathname === '/admin/employees' && 'Employee Management'}
            {location.pathname === '/profile' && 'Profile'}
            {location.pathname === '/settings' && 'Settings'}
          </div>
          
          {/* Right side - notifications & profile */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                onClick={(e) => {
                  e.stopPropagation();
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
              >
                <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700 animate-fade-in">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
                    <button 
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                            !notification.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                          }`}
                        >
                          <div className="flex items-start">
                            {!notification.read && (
                              <div className="mt-1.5 mr-2 w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                            )}
                            <div className={`flex-1 ${notification.read ? 'pl-4' : ''}`}>
                              <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No notifications
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
                    <Link 
                      to="/notifications"
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile */}
            <div className="relative">
              <button
                className="flex items-center space-x-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-300">
                      <User size={16} />
                    </div>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role === 'admin' ? 'Administrator' : user?.position}</p>
                </div>
              </button>
              
              {/* Profile dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700 animate-fade-in">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                  <div>
                    <Link 
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                    >
                      Your Profile
                    </Link>
                    <Link 
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="py-4 px-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          &copy; {new Date().getFullYear()} TimeOff. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;