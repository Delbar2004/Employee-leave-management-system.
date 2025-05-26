import { toast } from 'react-toastify';
import { mockLeaveRequests, mockLeaveTypes, mockLeaveBalances } from '../data/mockData';

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  reviewedBy?: string;
  reviewedOn?: string;
  comments?: string;
}

export interface LeaveType {
  id: string;
  name: string;
  description: string;
  defaultDays: number;
  isPaid: boolean;
  color: string;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  leaveTypeName: string;
  totalDays: number;
  usedDays: number;
  pendingDays: number;
  remainingDays: number;
  year: number;
}

export interface LeaveApplicationData {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface LeaveFilter {
  status?: LeaveStatus;
  leaveType?: string;
  department?: string;
  startDate?: string;
  endDate?: string;
  employeeId?: string;
}

class LeaveService {
  // Get leave requests for the current user
  async getMyLeaveRequests(): Promise<LeaveRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return [];
    }
    
    const user = JSON.parse(userJson);
    return mockLeaveRequests.filter(request => request.employeeId === user.id);
  }
  
  // Get all leave requests (admin)
  async getAllLeaveRequests(filters?: LeaveFilter): Promise<LeaveRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    let filteredRequests = [...mockLeaveRequests];
    
    if (filters) {
      // Apply filters
      if (filters.status) {
        filteredRequests = filteredRequests.filter(r => r.status === filters.status);
      }
      
      if (filters.leaveType) {
        filteredRequests = filteredRequests.filter(r => r.leaveType === filters.leaveType);
      }
      
      if (filters.department) {
        filteredRequests = filteredRequests.filter(r => r.department === filters.department);
      }
      
      if (filters.employeeId) {
        filteredRequests = filteredRequests.filter(r => r.employeeId === filters.employeeId);
      }
      
      if (filters.startDate) {
        const start = new Date(filters.startDate);
        filteredRequests = filteredRequests.filter(r => new Date(r.startDate) >= start);
      }
      
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        filteredRequests = filteredRequests.filter(r => new Date(r.endDate) <= end);
      }
    }
    
    // Sort by applied date (newest first)
    return filteredRequests.sort((a, b) => 
      new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime()
    );
  }
  
  // Get leave types
  async getLeaveTypes(): Promise<LeaveType[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLeaveTypes;
  }
  
  // Get leave balances for the current user
  async getMyLeaveBalances(): Promise<LeaveBalance[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return [];
    }
    
    const user = JSON.parse(userJson);
    return mockLeaveBalances.filter(balance => balance.employeeId === user.id);
  }
  
  // Apply for leave
  async applyForLeave(leaveData: LeaveApplicationData): Promise<LeaveRequest> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      throw new Error('User not authenticated');
    }
    
    const user = JSON.parse(userJson);
    
    // Calculate duration in days
    const start = new Date(leaveData.startDate);
    const end = new Date(leaveData.endDate);
    const durationMs = end.getTime() - start.getTime();
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24)) + 1;
    
    // Create new leave request
    const newLeave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: user.id,
      employeeName: user.name,
      department: user.department || 'General',
      leaveType: leaveData.leaveType,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      duration: durationDays,
      reason: leaveData.reason,
      status: 'pending',
      appliedOn: new Date().toISOString(),
    };
    
    // In a real app, you would send this to an API
    // For the demo, we'll just pretend it was saved
    
    toast.success('Leave request submitted successfully');
    return newLeave;
  }
  
  // Cancel leave request
  async cancelLeaveRequest(leaveId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, you would send this to an API
    // For the demo, we'll just pretend it was updated
    
    toast.info('Leave request cancelled');
  }
  
  // Review leave request (approve/reject) - admin only
  async reviewLeaveRequest(
    leaveId: string, 
    action: 'approved' | 'rejected', 
    comments?: string
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      throw new Error('User not authenticated');
    }
    
    const user = JSON.parse(userJson);
    
    // In a real app, you would send this to an API
    // For the demo, we'll just pretend it was updated
    
    toast.success(`Leave request ${action}`);
  }
  
  // Get leave statistics for dashboard
  async getLeaveStatistics(employeeId?: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // For the demo, return mock data
    return {
      approved: 12,
      pending: 3,
      rejected: 2,
      total: 17,
      byType: [
        { type: 'Annual', count: 8 },
        { type: 'Sick', count: 5 },
        { type: 'Personal', count: 2 },
        { type: 'Bereavement', count: 1 },
        { type: 'Unpaid', count: 1 }
      ],
      byMonth: [
        { month: 'Jan', count: 1 },
        { month: 'Feb', count: 2 },
        { month: 'Mar', count: 0 },
        { month: 'Apr', count: 3 },
        { month: 'May', count: 1 },
        { month: 'Jun', count: 2 },
        { month: 'Jul', count: 0 },
        { month: 'Aug', count: 3 },
        { month: 'Sep', count: 2 },
        { month: 'Oct', count: 1 },
        { month: 'Nov', count: 1 },
        { month: 'Dec', count: 1 }
      ]
    };
  }
}

export const leaveService = new LeaveService();