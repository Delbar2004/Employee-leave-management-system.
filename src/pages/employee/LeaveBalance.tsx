import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, PieChart, AlertCircle } from 'lucide-react';
import { leaveService, LeaveBalance as LeaveBalanceType } from '../../services/leaveService';
import { toast } from 'react-toastify';

const LeaveBalance = () => {
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalanceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentYear] = useState(new Date().getFullYear());
  
  useEffect(() => {
    const fetchLeaveBalances = async () => {
      try {
        const balances = await leaveService.getMyLeaveBalances();
        setLeaveBalances(balances);
      } catch (error) {
        console.error('Error fetching leave balances:', error);
        toast.error('Failed to load leave balances');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaveBalances();
  }, []);
  
  // Calculate overall totals
  const totals = leaveBalances.reduce(
    (acc, balance) => {
      acc.total += balance.totalDays;
      acc.used += balance.usedDays;
      acc.pending += balance.pendingDays;
      acc.remaining += balance.remainingDays;
      return acc;
    },
    { total: 0, used: 0, pending: 0, remaining: 0 }
  );
  
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Balance</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View your current leave balances for {currentYear}
        </p>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Leave Days</span>
            <div className="flex items-center mt-1">
              <Calendar size={20} className="text-primary-500 mr-2" />
              <span className="text-2xl font-semibold text-gray-900 dark:text-white">{totals.total}</span>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 dark:text-gray-400">Used Days</span>
            <div className="flex items-center mt-1">
              <PieChart size={20} className="text-error-500 mr-2" />
              <span className="text-2xl font-semibold text-gray-900 dark:text-white">{totals.used}</span>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 dark:text-gray-400">Pending Days</span>
            <div className="flex items-center mt-1">
              <Clock size={20} className="text-accent-500 mr-2" />
              <span className="text-2xl font-semibold text-gray-900 dark:text-white">{totals.pending}</span>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 dark:text-gray-400">Remaining Days</span>
            <div className="flex items-center mt-1">
              <Calendar size={20} className="text-success-500 mr-2" />
              <span className="text-2xl font-semibold text-gray-900 dark:text-white">{totals.remaining}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed balances */}
      <div className="card mb-6">
        <div className="card-header flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Detailed Balances</h2>
          <Link
            to="/leave/apply"
            className="btn btn-primary btn-sm"
          >
            Apply for Leave
          </Link>
        </div>
        
        {leaveBalances.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Used
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pending
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Remaining
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Usage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {leaveBalances.map((balance) => (
                  <tr key={balance.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {balance.leaveTypeName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-800 dark:text-gray-200">
                      {balance.totalDays}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-800 dark:text-gray-200">
                      {balance.usedDays}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {balance.pendingDays > 0 ? (
                        <span className="text-accent-600 dark:text-accent-400">
                          {balance.pendingDays}
                        </span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">0</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center font-medium">
                      {balance.remainingDays > 0 ? (
                        <span className="text-success-600 dark:text-success-400">
                          {balance.remainingDays}
                        </span>
                      ) : (
                        <span className="text-error-600 dark:text-error-400">0</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              balance.remainingDays === 0 
                                ? 'bg-error-500' 
                                : balance.remainingDays < balance.totalDays * 0.25 
                                  ? 'bg-warning-500' 
                                  : 'bg-success-500'
                            }`}
                            style={{ 
                              width: `${(balance.usedDays / balance.totalDays) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                          {Math.round((balance.usedDays / balance.totalDays) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Calendar size={24} className="text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No leave balances found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Please contact your administrator if you believe this is an error
            </p>
          </div>
        )}
      </div>
      
      {/* Leave policy information */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Leave Policy Information</h2>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="mt-1 text-primary-500">
                <AlertCircle size={16} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Annual Leave</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Full-time employees are entitled to 20 days of annual leave per year. Leave is accrued monthly.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="mt-1 text-primary-500">
                <AlertCircle size={16} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Sick Leave</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Employees receive 10 days of paid sick leave annually. A medical certificate is required for absences of 3 or more consecutive days.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="mt-1 text-primary-500">
                <AlertCircle size={16} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Personal Leave</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  5 days of personal leave is provided each year for personal matters, emergencies, or other obligations.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="mt-1 text-primary-500">
                <AlertCircle size={16} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Carry Forward Policy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Up to 5 days of unused annual leave can be carried forward to the next year. Carried forward leave must be used within the first 6 months.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="mt-1 text-primary-500">
                <AlertCircle size={16} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Request Policy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Leave requests should be submitted at least 3 working days in advance for proper planning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveBalance;