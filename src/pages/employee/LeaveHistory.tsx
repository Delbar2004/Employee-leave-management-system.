import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Filter, Clock, ChevronDown, ChevronUp, Search, X, RefreshCw } from 'lucide-react';
import { leaveService, LeaveRequest, LeaveStatus } from '../../services/leaveService';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';

const LeaveHistory = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    startDate: '',
    endDate: '',
    searchTerm: ''
  });
  
  useEffect(() => {
    fetchLeaveRequests();
  }, []);
  
  const fetchLeaveRequests = async () => {
    try {
      setIsLoading(true);
      const requests = await leaveService.getMyLeaveRequests();
      setLeaveRequests(requests);
      setFilteredRequests(requests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Failed to load leave requests');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Apply filters
    let result = [...leaveRequests];
    
    if (filters.status) {
      result = result.filter(request => request.status === filters.status);
    }
    
    if (filters.type) {
      result = result.filter(request => request.leaveType === filters.type);
    }
    
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      result = result.filter(request => new Date(request.startDate) >= startDate);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      result = result.filter(request => new Date(request.endDate) <= endDate);
    }
    
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      result = result.filter(
        request => 
          request.leaveType.toLowerCase().includes(searchTerm) ||
          request.reason.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredRequests(result);
  }, [filters, leaveRequests]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const resetFilters = () => {
    setFilters({
      status: '',
      type: '',
      startDate: '',
      endDate: '',
      searchTerm: ''
    });
  };
  
  const cancelLeaveRequest = async (leaveId: string) => {
    if (window.confirm('Are you sure you want to cancel this leave request?')) {
      try {
        await leaveService.cancelLeaveRequest(leaveId);
        
        // Update the local state
        setLeaveRequests(prev => 
          prev.map(request => 
            request.id === leaveId 
              ? { ...request, status: 'cancelled' as LeaveStatus } 
              : request
          )
        );
        
        setSelectedRequest(prev => 
          prev && prev.id === leaveId 
            ? { ...prev, status: 'cancelled' as LeaveStatus }
            : prev
        );
        
        toast.success('Leave request cancelled successfully');
      } catch (error) {
        console.error('Error cancelling leave request:', error);
        toast.error('Failed to cancel leave request');
      }
    }
  };
  
  // Function to get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300';
      case 'pending':
        return 'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300';
      case 'rejected':
        return 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  // Extract unique leave types for filter dropdown
  const uniqueLeaveTypes = Array.from(new Set(leaveRequests.map(req => req.leaveType)));
  
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave History</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and manage all your leave requests
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10 w-full"
            placeholder="Search requests..."
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline px-3 py-2"
          >
            <Filter size={16} className="mr-2" />
            Filters
            {showFilters ? (
              <ChevronUp size={16} className="ml-2" />
            ) : (
              <ChevronDown size={16} className="ml-2" />
            )}
          </button>
          
          <button
            onClick={fetchLeaveRequests}
            className="btn btn-outline px-3 py-2"
            aria-label="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          
          <Link
            to="/leave/apply"
            className="btn btn-primary px-3 py-2"
          >
            <Calendar size={16} className="mr-2" />
            Apply for Leave
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="card mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="status" className="label">Status</label>
              <select
                id="status"
                name="status"
                className="input"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="type" className="label">Leave Type</label>
              <select
                id="type"
                name="type"
                className="input"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                {uniqueLeaveTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="startDate" className="label">From Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="input"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="label">To Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="input"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={resetFilters}
              className="btn btn-outline px-3 py-2"
            >
              <X size={16} className="mr-2" />
              Reset Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Leave requests list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Leave Requests 
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({filteredRequests.length})
                </span>
              </h2>
            </div>
            
            {filteredRequests.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
                      selectedRequest?.id === request.id ? 'bg-gray-50 dark:bg-gray-800' : ''
                    }`}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {request.leaveType}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {format(parseISO(request.startDate), 'MMM dd, yyyy')} - {format(parseISO(request.endDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <span className={`badge ${getStatusBadgeClass(request.status)} capitalize`}>
                        {request.status}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock size={14} className="mr-1" />
                      <span>{request.duration} day{request.duration !== 1 ? 's' : ''}</span>
                      <span className="mx-2">•</span>
                      <span>Applied on {format(parseISO(request.appliedOn), 'MMM dd, yyyy')}</span>
                    </div>
                    
                    <div className="mt-1 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Reason: </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {request.reason.length > 100 
                          ? `${request.reason.substring(0, 100)}...` 
                          : request.reason
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Calendar size={24} className="text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No leave requests found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {filters.status || filters.type || filters.startDate || filters.endDate || filters.searchTerm
                    ? 'Try adjusting your filters to see more results'
                    : 'Apply for a new leave to see it listed here'}
                </p>
                <Link to="/leave/apply" className="btn btn-primary">
                  Apply for Leave
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Leave request details */}
        <div>
          {selectedRequest ? (
            <div className="card">
              <div className="card-header flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Request Details</h3>
                <span className={`badge ${getStatusBadgeClass(selectedRequest.status)} capitalize`}>
                  {selectedRequest.status}
                </span>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Leave Type</h4>
                    <p className="mt-1 text-gray-900 dark:text-white">{selectedRequest.leaveType}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</h4>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {format(parseISO(selectedRequest.startDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</h4>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {format(parseISO(selectedRequest.endDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</h4>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {selectedRequest.duration} working day{selectedRequest.duration !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reason</h4>
                    <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-line">
                      {selectedRequest.reason}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Applied On</h4>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {format(parseISO(selectedRequest.appliedOn), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    {selectedRequest.reviewedOn && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reviewed On</h4>
                        <p className="mt-1 text-gray-900 dark:text-white">
                          {format(parseISO(selectedRequest.reviewedOn), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {selectedRequest.reviewedBy && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reviewed By</h4>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {selectedRequest.reviewedBy}
                      </p>
                    </div>
                  )}
                  
                  {selectedRequest.comments && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Comments</h4>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {selectedRequest.comments}
                      </p>
                    </div>
                  )}
                  
                  {selectedRequest.status === 'pending' && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => cancelLeaveRequest(selectedRequest.id)}
                        className="btn btn-outline border-error-500 text-error-600 hover:bg-error-50 dark:border-error-700 dark:text-error-400 dark:hover:bg-error-900/20"
                      >
                        Cancel Request
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Calendar size={24} className="text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No request selected</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Select a leave request to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveHistory;