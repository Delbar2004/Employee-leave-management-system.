import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  X, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  User, 
  Calendar,
  CheckCircle,
  XCircle,
  MessageSquare,
  MoreHorizontal,
  Eye
} from 'lucide-react';
import { leaveService, LeaveRequest, LeaveStatus } from '../../services/leaveService';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { mockDepartments } from '../../data/mockData';

const LeaveRequests = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    department: '',
    startDate: '',
    endDate: '',
    searchTerm: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get the request ID from URL query params if available
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const requestId = searchParams.get('id');
    
    if (requestId) {
      // We'll select this request once data is loaded
      const savedRequestId = requestId;
      
      fetchLeaveRequests().then(() => {
        const foundRequest = leaveRequests.find(r => r.id === savedRequestId);
        if (foundRequest) {
          setSelectedRequest(foundRequest);
        }
      });
    } else {
      fetchLeaveRequests();
    }
  }, [location.search]);
  
  const fetchLeaveRequests = async () => {
    try {
      setIsLoading(true);
      const requests = await leaveService.getAllLeaveRequests();
      setLeaveRequests(requests);
      setFilteredRequests(requests);
      return requests;
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Failed to load leave requests');
      return [];
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
    
    if (filters.department) {
      result = result.filter(request => request.department === filters.department);
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
          request.employeeName.toLowerCase().includes(searchTerm) ||
          request.leaveType.toLowerCase().includes(searchTerm) ||
          request.reason.toLowerCase().includes(searchTerm) ||
          request.department.toLowerCase().includes(searchTerm)
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
      department: '',
      startDate: '',
      endDate: '',
      searchTerm: ''
    });
  };
  
  const handleReviewAction = async (action: 'approved' | 'rejected') => {
    if (!selectedRequest) return;
    
    setIsSubmitting(true);
    
    try {
      await leaveService.reviewLeaveRequest(selectedRequest.id, action, reviewComment);
      
      // Update local state
      const updatedRequests = leaveRequests.map(request => 
        request.id === selectedRequest.id 
          ? { 
              ...request, 
              status: action, 
              reviewedBy: 'John Admin', // In a real app, this would be the current user
              reviewedOn: new Date().toISOString(),
              comments: reviewComment
            } 
          : request
      );
      
      setLeaveRequests(updatedRequests);
      setFilteredRequests(
        filteredRequests.map(request => 
          request.id === selectedRequest.id 
            ? { 
                ...request, 
                status: action, 
                reviewedBy: 'John Admin',
                reviewedOn: new Date().toISOString(),
                comments: reviewComment
              } 
            : request
        )
      );
      
      setSelectedRequest({
        ...selectedRequest,
        status: action,
        reviewedBy: 'John Admin',
        reviewedOn: new Date().toISOString(),
        comments: reviewComment
      });
      
      setReviewComment('');
      toast.success(`Leave request ${action}`);
    } catch (error) {
      console.error(`Error ${action} leave request:`, error);
      toast.error(`Failed to ${action} leave request`);
    } finally {
      setIsSubmitting(false);
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Requests</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Review and manage employee leave requests
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
            placeholder="Search by name, type..."
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
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="card mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label htmlFor="department" className="label">Department</label>
              <select
                id="department"
                name="department"
                className="input"
                value={filters.department}
                onChange={handleFilterChange}
              >
                <option value="">All Departments</option>
                {mockDepartments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
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
      
      {/* Leave requests list and details */}
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Employee
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Leave Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Duration
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredRequests.map((request) => (
                      <tr 
                        key={request.id} 
                        className={`hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                          selectedRequest?.id === request.id ? 'bg-gray-50 dark:bg-gray-750' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <User size={16} className="text-gray-600 dark:text-gray-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {request.employeeName}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {request.department}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{request.leaveType}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {format(parseISO(request.startDate), 'MMM dd')} - {format(parseISO(request.endDate), 'MMM dd')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {request.duration} day{request.duration !== 1 ? 's' : ''}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Applied {format(parseISO(request.appliedOn), 'MMM dd')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge ${getStatusBadgeClass(request.status)} capitalize`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                          >
                            <Eye size={16} />
                          </button>
                          <div className="relative inline-block text-left">
                            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Calendar size={24} className="text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No leave requests found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {filters.status || filters.type || filters.department || filters.startDate || filters.endDate || filters.searchTerm
                    ? 'Try adjusting your filters to see more results'
                    : 'There are no leave requests to review at this time'}
                </p>
                {(filters.status || filters.type || filters.department || filters.startDate || filters.endDate || filters.searchTerm) && (
                  <button
                    onClick={resetFilters}
                    className="btn btn-outline"
                  >
                    Reset Filters
                  </button>
                )}
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
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User size={20} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{selectedRequest.employeeName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedRequest.department}</p>
                    </div>
                  </div>
                  
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
                      <div className="mb-4">
                        <label htmlFor="comments" className="label flex items-center">
                          <MessageSquare size={16} className="mr-2" />
                          Comments (optional)
                        </label>
                        <textarea
                          id="comments"
                          rows={3}
                          className="input"
                          placeholder="Add your comments here..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                        ></textarea>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => handleReviewAction('approved')}
                          disabled={isSubmitting}
                          className="btn btn-success flex-1"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Approving...</span>
                            </div>
                          ) : (
                            <>
                              <CheckCircle size={16} className="mr-2" />
                              Approve
                            </>
                          )}
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleReviewAction('rejected')}
                          disabled={isSubmitting}
                          className="btn btn-error flex-1"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Rejecting...</span>
                            </div>
                          ) : (
                            <>
                              <XCircle size={16} className="mr-2" />
                              Reject
                            </>
                          )}
                        </button>
                      </div>
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

export default LeaveRequests;