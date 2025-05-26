import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Lock, Eye, EyeOff, Globe, Moon, Sun, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-toastify';

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    leaveUpdates: true,
    leaveReminders: true,
    systemUpdates: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to change the password
      toast.success('Password changed successfully');
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSaveNotifications = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to update notification settings
      toast.success('Notification settings saved');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('Failed to save notification settings');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings navigation */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="p-4">
              <nav className="space-y-1">
                <a href="#account" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                  <User size={16} className="mr-3" />
                  <span>Account Settings</span>
                </a>
                <a href="#password" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100">
                  <Lock size={16} className="mr-3" />
                  <span>Password</span>
                </a>
                <a href="#notifications" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100">
                  <Bell size={16} className="mr-3" />
                  <span>Notifications</span>
                </a>
                <a href="#appearance" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100">
                  <Globe size={16} className="mr-3" />
                  <span>Appearance</span>
                </a>
              </nav>
            </div>
          </div>
          
          <div className="card mt-6 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-error-600 hover:bg-error-50 hover:text-error-700 dark:text-error-400 dark:hover:bg-error-900/20 dark:hover:text-error-300"
            >
              <LogOut size={16} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
        
        {/* Settings content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Settings */}
          <div id="account" className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Account Settings
              </h2>
            </div>
            <div className="card-body">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Manage your account information and preferences.
              </p>
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-gray-900 dark:text-white font-medium">Profile Information</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Update your profile details like name, email, and department
                  </p>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="btn btn-outline"
                >
                  Edit Profile
                </button>
              </div>
              
              <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-gray-900 dark:text-white font-medium">Email Preferences</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Manage how and when you receive email notifications
                  </p>
                </div>
                <button
                  onClick={() => document.getElementById('notifications')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn btn-outline"
                >
                  Configure
                </button>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div>
                  <h3 className="text-error-600 dark:text-error-400 font-medium">Delete Account</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Permanently delete your account and all data
                  </p>
                </div>
                <button
                  onClick={() => toast.error('Account deletion requires administrator approval')}
                  className="btn btn-outline border-error-500 text-error-600 hover:bg-error-50 dark:border-error-700 dark:text-error-400 dark:hover:bg-error-900/20"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
          
          {/* Password Settings */}
          <div id="password" className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Change Password
              </h2>
            </div>
            <div className="card-body">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Ensure your account is using a long, random password to stay secure.
              </p>
              
              <form onSubmit={handleChangePassword}>
                <div className="space-y-4">
                  <div className="form-control">
                    <label htmlFor="currentPassword" className="label">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="input pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={16} className="text-gray-500 dark:text-gray-400" />
                        ) : (
                          <Eye size={16} className="text-gray-500 dark:text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="form-control">
                    <label htmlFor="newPassword" className="label">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="input pr-10"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff size={16} className="text-gray-500 dark:text-gray-400" />
                        ) : (
                          <Eye size={16} className="text-gray-500 dark:text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  
                  <div className="form-control">
                    <label htmlFor="confirmPassword" className="label">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="input pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} className="text-gray-500 dark:text-gray-400" />
                        ) : (
                          <Eye size={16} className="text-gray-500 dark:text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Changing...
                        </div>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          {/* Notification Settings */}
          <div id="notifications" className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Notification Settings
              </h2>
            </div>
            <div className="card-body">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Manage how and when you receive notifications about leave requests and system updates.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-medium">Email Notifications</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Receive notifications via email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      name="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between pl-6">
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-medium">Leave Request Updates</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Notifications when your leave request status changes
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      name="leaveUpdates"
                      checked={notificationSettings.leaveUpdates}
                      onChange={handleNotificationChange}
                      disabled={!notificationSettings.emailNotifications}
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600 ${!notificationSettings.emailNotifications ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between pl-6">
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-medium">Leave Balance Reminders</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Periodic reminders about your leave balance
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      name="leaveReminders"
                      checked={notificationSettings.leaveReminders}
                      onChange={handleNotificationChange}
                      disabled={!notificationSettings.emailNotifications}
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600 ${!notificationSettings.emailNotifications ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between pl-6">
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-medium">System Updates</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Notifications about system changes and updates
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      name="systemUpdates"
                      checked={notificationSettings.systemUpdates}
                      onChange={handleNotificationChange}
                      disabled={!notificationSettings.emailNotifications}
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600 ${!notificationSettings.emailNotifications ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                  </label>
                </div>
                
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveNotifications}
                    disabled={isSubmitting}
                    className="btn btn-primary"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </div>
                    ) : (
                      'Save Preferences'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Appearance Settings */}
          <div id="appearance" className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Appearance
              </h2>
            </div>
            <div className="card-body">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Customize how the application looks and feels.
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900 dark:text-white font-medium">Theme</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Choose between light and dark mode
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {theme === 'light' ? (
                    <>
                      <Sun size={16} className="text-accent-500" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon size={16} className="text-primary-400" />
                      <span>Dark</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;