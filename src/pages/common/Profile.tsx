import { useState } from 'react';
import { User, Mail, Briefcase, Calendar, Building, MapPin, Edit2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { mockDepartments, mockPositions } from '../../data/mockData';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    position: user?.position || '',
    address: 'New York, NY',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate professional with expertise in team management and project delivery.'
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to update the user profile
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
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
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and manage your profile information
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 h-32"></div>
            <div className="px-6 pb-6">
              <div className="flex justify-center -mt-12 mb-4">
                <div className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <User size={48} className="text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{user?.email}</p>
                <div className="mt-2">
                  <span className={`badge ${
                    user?.role === 'admin' 
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300' 
                      : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300'
                  } capitalize`}>
                    {user?.role}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Briefcase size={18} className="mr-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <span>{user?.position || 'Position not set'}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Building size={18} className="mr-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <span>{user?.department || 'Department not set'}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <MapPin size={18} className="mr-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <span>New York, NY</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Calendar size={18} className="mr-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <span>Joined {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-outline w-full"
                >
                  <Edit2 size={16} className="mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
          
          {/* Leave Statistics */}
          <div className="card mt-6">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Leave Statistics</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Annual Leave</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">10/20 days</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sick Leave</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">3/10 days</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-error-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Personal Leave</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">1/5 days</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-accent-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Details */}
        <div className="lg:col-span-2">
          {isEditing ? (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Edit Profile</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="form-control">
                      <label htmlFor="name" className="label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>
                    
                    <div className="form-control">
                      <label htmlFor="email" className="label">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input"
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Email address cannot be changed
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label htmlFor="department" className="label">
                          Department
                        </label>
                        <select
                          id="department"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="input"
                        >
                          <option value="">Select Department</option>
                          {mockDepartments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-control">
                        <label htmlFor="position" className="label">
                          Position
                        </label>
                        <select
                          id="position"
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          className="input"
                        >
                          <option value="">Select Position</option>
                          {mockPositions.map((pos) => (
                            <option key={pos} value={pos}>{pos}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label htmlFor="phone" className="label">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="input"
                        />
                      </div>
                      
                      <div className="form-control">
                        <label htmlFor="address" className="label">
                          Location
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="input"
                        />
                      </div>
                    </div>
                    
                    <div className="form-control">
                      <label htmlFor="bio" className="label">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="input"
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </div>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <>
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                          <User size={16} className="mr-2" />
                          Full Name
                        </h4>
                        <p className="mt-1 text-gray-900 dark:text-white">{user?.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                          <Mail size={16} className="mr-2" />
                          Email Address
                        </h4>
                        <p className="mt-1 text-gray-900 dark:text-white">{user?.email}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                          <Building size={16} className="mr-2" />
                          Department
                        </h4>
                        <p className="mt-1 text-gray-900 dark:text-white">{user?.department || 'Not specified'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                          <Briefcase size={16} className="mr-2" />
                          Position
                        </h4>
                        <p className="mt-1 text-gray-900 dark:text-white">{user?.position || 'Not specified'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                          <MapPin size={16} className="mr-2" />
                          Location
                        </h4>
                        <p className="mt-1 text-gray-900 dark:text-white">New York, NY</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar size={16} className="mr-2" />
                          Join Date
                        </h4>
                        <p className="mt-1 text-gray-900 dark:text-white">
                          {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card mt-6">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">About Me</h3>
                </div>
                <div className="card-body">
                  <p className="text-gray-700 dark:text-gray-300">
                    Passionate professional with expertise in team management and project delivery. 
                    I specialize in streamlining processes and improving efficiency across departments.
                    In my free time, I enjoy hiking, reading, and exploring new technologies.
                  </p>
                </div>
              </div>
              
              <div className="card mt-6">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="p-4 flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <Calendar size={16} className="text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-800 dark:text-gray-200">
                        Applied for Annual Leave
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        November 15, 2023 at 10:30 AM
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                        <Briefcase size={16} className="text-success-600 dark:text-success-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-800 dark:text-gray-200">
                        Profile information updated
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        October 28, 2023 at 2:15 PM
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="w-8 h-8 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                        <User size={16} className="text-accent-600 dark:text-accent-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-800 dark:text-gray-200">
                        Account created
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;