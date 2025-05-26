import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ClipboardCheck, 
  ClipboardList, 
  Calendar, 
  FileX, 
  FileClock, 
  ChevronRight,
  User,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { leaveService, LeaveRequest } from '../../services/leaveService';
import { format, parseISO, subDays } from 'date-fns';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 5,
    leaveToday: 2,
    pendingRequests: 0,
    approvedThisMonth: 0,
    departments: [],
    byType: []
  });
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [requests, statistics] = await Promise.all([
          leaveService.getAllLeaveRequests({ status: 'pending' }),
          leaveService.getLeaveStatistics()
        ]);
        
        setPendingRequests(requests);
        
        // In a real app, we would get this data from the API
        setStats({
          totalEmployees: 5,
          leaveToday: 2,
          pendingRequests: requests.length,
          approvedThisMonth: 8,
          departments: [
            { name: 'Engineering', count: 10 },
            { name: 'Marketing', count: 5 },
            { name: 'Finance', count: 3 },
            { name: 'HR', count: 2 },
            { name: 'Sales', count: 4 }
          ],
          byType: statistics.byType
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Department distribution chart
  const departmentData = {
    labels: stats.departments.map((dept: any) => dept.name),
    datasets: [
      {
        label: 'Employees',
        data: stats.departments.map((dept: any) => dept.count),
        backgroundColor: [
          '#3B82F6',
          '#14B8A6',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#EC4899',
        ],
        borderWidth: 0,
      },
    ],
  };
  
  // Leave type distribution chart
  const leaveTypeData = {
    labels: stats.byType.map((type: any) => type.type),
    datasets: [
      {
        label: 'Requests',
        data: stats.byType.map((type: any) => type.count),
        backgroundColor: '#3B82F6',
        borderRadius: 4,
      },
    ],
  };
  
  // Chart options
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
  };
  
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Leave Requests by Type',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let bgColor = '';
    let textColor = '';
    
    switch (status) {
      case 'approved':
        bgColor = 'bg-success-100 dark:bg-success-900/30';
        textColor = 'text-success-800 dark:text-success-300';
        break;
      case 'pending':
        bgColor = 'bg-accent-100 dark:bg-accent-900/30';
        textColor = 'text-accent-800 dark:text-accent-300';
        break;
      case 'rejected':
        bgColor = 'bg-error-100 dark:bg-error-900/30';
        textColor = 'text-error-800 dark:text-error-300';
        break;
      default:
        bgColor = 'bg-gray-100 dark:bg-gray-800';
        textColor = 'text-gray-800 dark:text-gray-300';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor} capitalize`}>
        {status}
      </span>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back, {user?.name}. Here's what's happening with leave management.
        </p>
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link
          to="/admin/leave-requests"
          className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 flex items-center justify-between transition-all hover:shadow-md"
        >
          <div className="flex items-center">
            <div className="bg-primary-100 dark:bg-primary-800 p-3 rounded-lg text-primary-600 dark:text-primary-400 mr-3">
              <ClipboardList size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Manage Leave Requests</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Review and approve requests</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </Link>
        
        <Link
          to="/admin/employees"
          className="bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 rounded-lg p-4 flex items-center justify-between transition-all hover:shadow-md"
        >
          <div className="flex items-center">
            <div className="bg-secondary-100 dark:bg-secondary-800 p-3 rounded-lg text-secondary-600 dark:text-secondary-400 mr-3">
              <Users size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Employee Management</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage employee information</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </Link>
        
        <Link
          to="/admin/reports"
          className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-4 flex items-center justify-between transition-all hover:shadow-md"
        >
          <div className="flex items-center">
            <div className="bg-accent-100 dark:bg-accent-800 p-3 rounded-lg text-accent-600 dark:text-accent-400 mr-3">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Reports & Analytics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View leave statistics</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </Link>
      </div>
      
      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Employees</p>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{stats.totalEmployees}</h3>
            </div>
            <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg text-primary-600 dark:text-primary-400">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-center mt-2 text-xs">
            <span className="flex items-center text-success-500">
              <ArrowUpRight size={14} className="mr-1" />
              <span>+2 this month</span>
            </span>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">On Leave Today</p>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{stats.leaveToday}</h3>
            </div>
            <div className="bg-secondary-100 dark:bg-secondary-900/30 p-3 rounded-lg text-secondary-600 dark:text-secondary-400">
              <Calendar size={20} />
            </div>
          </div>
          <div className="flex items-center mt-2 text-xs">
            <Link to="/admin/leave-requests" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              View who's out today
            </Link>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Requests</p>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{stats.pendingRequests}</h3>
            </div>
            <div className="bg-accent-100 dark:bg-accent-900/30 p-3 rounded-lg text-accent-600 dark:text-accent-400">
              <FileClock size={20} />
            </div>
          </div>
          <div className="flex items-center mt-2 text-xs">
            <span className={stats.pendingRequests > 5 ? 'text-error-500' : 'text-success-500'}>
              {stats.pendingRequests > 5 
                ? <ArrowUpRight size={14} className="mr-1 inline" />
                : <ArrowDownRight size={14} className="mr-1 inline" />
              }
              <span>{stats.pendingRequests > 5 ? 'Needs attention' : 'All under control'}</span>
            </span>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Approved This Month</p>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{stats.approvedThisMonth}</h3>
            </div>
            <div className="bg-success-100 dark:bg-success-900/30 p-3 rounded-lg text-success-600 dark:text-success-400">
              <ClipboardCheck size={20} />
            </div>
          </div>
          <div className="flex items-center mt-2 text-xs">
            <span className="flex items-center text-success-500">
              <ArrowUpRight size={14} className="mr-1" />
              <span>+3 from last month</span>
            </span>
          </div>
        </div>
      </div>
      
      {/* Charts & Pending requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Charts section */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Department Distribution</h3>
            </div>
            <div className="card-body">
              <div className="h-64">
                <Doughnut data={departmentData} options={doughnutOptions} />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Leave Types</h3>
            </div>
            <div className="card-body">
              <div className="h-64">
                <Bar data={leaveTypeData} options={barOptions} />
              </div>
            </div>
          </div>
          
          {/* Leave calendar coming soon */}
          <div className="card md:col-span-2">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Leave Calendar</h3>
            </div>
            <div className="card-body p-6">
              <div className="flex flex-col items-center justify-center h-48">
                <Calendar size={48} className="text-gray-400 mb-4" />
                <p className="text-gray-700 dark:text-gray-300 text-center">Leave calendar view coming soon</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                  This feature will show a monthly calendar view of all approved leave requests
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pending requests */}
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pending Requests</h3>
            <Link
              to="/admin/leave-requests"
              className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View all
            </Link>
          </div>
          
          {pendingRequests.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {pendingRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{request.employeeName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{request.department}</p>
                      </div>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{request.leaveType}</span> • 
                      <span className="ml-1">{request.duration} day{request.duration !== 1 ? 's' : ''}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {format(parseISO(request.startDate), 'MMM dd')} - {format(parseISO(request.endDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  
                  <div className="mt-3 flex space-x-2">
                    <Link
                      to={`/admin/leave-requests?id=${request.id}`}
                      className="btn btn-sm btn-primary py-1 px-3"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <ClipboardCheck size={24} className="text-success-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">All caught up!</h3>
              <p className="text-gray-500 dark:text-gray-400">
                No pending leave requests to review
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent activity */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="p-4 flex items-start">
            <div className="mr-4 mt-1">
              <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                <ClipboardCheck size={16} className="text-success-600 dark:text-success-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-medium">John Admin</span> approved <span className="font-medium">Robert Smith</span>'s leave request
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {format(subDays(new Date(), 1), 'MMM dd, yyyy')} at 10:30 AM
              </p>
            </div>
          </div>
          
          <div className="p-4 flex items-start">
            <div className="mr-4 mt-1">
              <div className="w-8 h-8 rounded-full bg-error-100 dark:bg-error-900/30 flex items-center justify-center">
                <FileX size={16} className="text-error-600 dark:text-error-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-medium">John Admin</span> rejected <span className="font-medium">Michael Johnson</span>'s leave request
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {format(subDays(new Date(), 2), 'MMM dd, yyyy')} at 2:15 PM
              </p>
            </div>
          </div>
          
          <div className="p-4 flex items-start">
            <div className="mr-4 mt-1">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <User size={16} className="text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-medium">Emily Davis</span> submitted a new leave request
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {format(subDays(new Date(), 3), 'MMM dd, yyyy')} at 9:45 AM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;