import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, FileCheck, FileClock, FileX, ChevronRight, BarChart2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { leaveService, LeaveRequest, LeaveBalance } from '../../services/leaveService';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
    total: 0,
    byType: [],
    byMonth: []
  });
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch data in parallel
        const [requests, balances, statistics] = await Promise.all([
          leaveService.getMyLeaveRequests(),
          leaveService.getMyLeaveBalances(),
          leaveService.getLeaveStatistics(user?.id)
        ]);
        
        setLeaveRequests(requests);
        setLeaveBalances(balances);
        setStats(statistics);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user?.id]);
  
  // Calculate overall leave balance stats
  const totalBalanceData = {
    labels: ['Used', 'Pending', 'Remaining'],
    datasets: [
      {
        data: [
          leaveBalances.reduce((sum, balance) => sum + balance.usedDays, 0),
          leaveBalances.reduce((sum, balance) => sum + balance.pendingDays, 0),
          leaveBalances.reduce((sum, balance) => sum + balance.remainingDays, 0)
        ],
        backgroundColor: ['#3B82F6', '#F59E0B', '#10B981'],
        borderWidth: 0,
      },
    ],
  };
  
  // Status distribution chart
  const statusData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [stats.approved, stats.pending, stats.rejected],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };
  
  // Monthly distribution chart
  const monthlyData = {
    labels: stats.byMonth?.map((item: any) => item.month) || [],
    datasets: [
      {
        label: 'Leave Requests',
        data: stats.byMonth?.map((item: any) => item.count) || [],
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
        text: 'Monthly Leave Distribution',
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
  
  // Get latest requests
  const latestRequests = [...leaveRequests]
    .sort((a, b) => new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime())
    .slice(0, 5);
  
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Here's an overview of your leave status and recent requests
        </p>
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link
          to="/leave/apply"
          className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 flex items-center justify-between transition-all hover:shadow-md"
        >
          <div className="flex items-center">
            <div className="bg-primary-100 dark:bg-primary-800 p-3 rounded-lg text-primary-600 dark:text-primary-400 mr-3">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Apply for Leave</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Request time off</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </Link>
        
        <Link
          to="/leave/history"
          className="bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 rounded-lg p-4 flex items-center justify-between transition-all hover:shadow-md"
        >
          <div className="flex items-center">
            <div className="bg-secondary-100 dark:bg-secondary-800 p-3 rounded-lg text-secondary-600 dark:text-secondary-400 mr-3">
              <FileCheck size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Leave History</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View all requests</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </Link>
        
        <Link
          to="/leave/balance"
          className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-4 flex items-center justify-between transition-all hover:shadow-md"
        >
          <div className="flex items-center">
            <div className="bg-accent-100 dark:bg-accent-800 p-3 rounded-lg text-accent-600 dark:text-accent-400 mr-3">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Leave Balance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Check your balance</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </Link>
      </div>
      
      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="bg-success-100 dark:bg-success-900/30 p-3 rounded-lg text-success-600 dark:text-success-400 mr-3">
              <FileCheck size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{stats.approved}</h3>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="bg-accent-100 dark:bg-accent-900/30 p-3 rounded-lg text-accent-600 dark:text-accent-400 mr-3">
              <FileClock size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{stats.pending}</h3>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="bg-error-100 dark:bg-error-900/30 p-3 rounded-lg text-error-600 dark:text-error-400 mr-3">
              <FileX size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{stats.rejected}</h3>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg text-primary-600 dark:text-primary-400 mr-3">
              <BarChart2 size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{stats.total}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts & Recent requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Charts section */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Leave Balance</h3>
            </div>
            <div className="card-body">
              <div className="h-64">
                <Doughnut data={totalBalanceData} options={doughnutOptions} />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Leave Status</h3>
            </div>
            <div className="card-body">
              <div className="h-64">
                <Doughnut data={statusData} options={doughnutOptions} />
              </div>
            </div>
          </div>
          
          <div className="card md:col-span-2">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Monthly Distribution</h3>
            </div>
            <div className="card-body">
              <div className="h-64">
                <Bar data={monthlyData} options={barOptions} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent leave requests */}
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Requests</h3>
            <Link
              to="/leave/history"
              className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {latestRequests.length > 0 ? (
              latestRequests.map((request) => (
                <div key={request.id} className="p-4">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {request.leaveType}
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                  <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    Applied on {new Date(request.appliedOn).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No recent leave requests
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Leave balance cards */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Leave Balances</h2>
          <Link
            to="/leave/balance"
            className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View details
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {leaveBalances.length > 0 ? (
            leaveBalances.map((balance) => (
              <div key={balance.id} className="card p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900 dark:text-white">{balance.leaveTypeName}</h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{balance.year}</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{balance.remainingDays}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">remaining</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Total: </span>
                      <span className="font-medium text-gray-900 dark:text-white">{balance.totalDays}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Used: </span>
                      <span className="font-medium text-gray-900 dark:text-white">{balance.usedDays}</span>
                    </div>
                    {balance.pendingDays > 0 && (
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Pending: </span>
                        <span className="font-medium text-accent-600 dark:text-accent-400">{balance.pendingDays}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(balance.usedDays / balance.totalDays) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-6 text-gray-500 dark:text-gray-400">
              No leave balances found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;