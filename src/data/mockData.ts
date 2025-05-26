import { User } from '../contexts/AuthContext';
import { LeaveRequest, LeaveType, LeaveBalance } from '../services/leaveService';

// Mock users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Admin',
    email: 'admin@example.com',
    role: 'admin',
    department: 'Management',
    position: 'HR Manager',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    joinDate: '2020-01-15T00:00:00.000Z'
  },
  {
    id: 'user-2',
    name: 'Jane Employee',
    email: 'employee@example.com',
    role: 'employee',
    department: 'Engineering',
    position: 'Software Engineer',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    joinDate: '2021-03-10T00:00:00.000Z'
  },
  {
    id: 'user-3',
    name: 'Robert Smith',
    email: 'robert@example.com',
    role: 'employee',
    department: 'Marketing',
    position: 'Marketing Specialist',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    joinDate: '2022-02-18T00:00:00.000Z'
  },
  {
    id: 'user-4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'employee',
    department: 'Finance',
    position: 'Financial Analyst',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    joinDate: '2021-07-05T00:00:00.000Z'
  },
  {
    id: 'user-5',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    role: 'employee',
    department: 'Engineering',
    position: 'Product Designer',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    joinDate: '2022-05-12T00:00:00.000Z'
  }
];

// Mock leave types
export const mockLeaveTypes: LeaveType[] = [
  {
    id: 'leave-type-1',
    name: 'Annual Leave',
    description: 'Regular vacation time for rest and relaxation',
    defaultDays: 20,
    isPaid: true,
    color: '#3B82F6' // primary-500
  },
  {
    id: 'leave-type-2',
    name: 'Sick Leave',
    description: 'Leave due to illness or medical appointments',
    defaultDays: 10,
    isPaid: true,
    color: '#EF4444' // error-500
  },
  {
    id: 'leave-type-3',
    name: 'Personal Leave',
    description: 'Leave for personal matters and obligations',
    defaultDays: 5,
    isPaid: true,
    color: '#8B5CF6' // purple-500
  },
  {
    id: 'leave-type-4',
    name: 'Bereavement',
    description: 'Leave following the death of a family member',
    defaultDays: 5,
    isPaid: true,
    color: '#6B7280' // gray-500
  },
  {
    id: 'leave-type-5',
    name: 'Parental Leave',
    description: 'Leave for new parents following birth or adoption',
    defaultDays: 90,
    isPaid: true,
    color: '#F59E0B' // accent-500
  },
  {
    id: 'leave-type-6',
    name: 'Unpaid Leave',
    description: 'Extended leave without pay',
    defaultDays: 30,
    isPaid: false,
    color: '#A1A1AA' // zinc-400
  }
];

// Mock leave balances
export const mockLeaveBalances: LeaveBalance[] = [
  // Jane Employee
  {
    id: 'balance-1',
    employeeId: 'user-2',
    leaveTypeId: 'leave-type-1',
    leaveTypeName: 'Annual Leave',
    totalDays: 20,
    usedDays: 8,
    pendingDays: 2,
    remainingDays: 10,
    year: 2023
  },
  {
    id: 'balance-2',
    employeeId: 'user-2',
    leaveTypeId: 'leave-type-2',
    leaveTypeName: 'Sick Leave',
    totalDays: 10,
    usedDays: 3,
    pendingDays: 0,
    remainingDays: 7,
    year: 2023
  },
  {
    id: 'balance-3',
    employeeId: 'user-2',
    leaveTypeId: 'leave-type-3',
    leaveTypeName: 'Personal Leave',
    totalDays: 5,
    usedDays: 1,
    pendingDays: 0,
    remainingDays: 4,
    year: 2023
  },
  // Robert Smith
  {
    id: 'balance-4',
    employeeId: 'user-3',
    leaveTypeId: 'leave-type-1',
    leaveTypeName: 'Annual Leave',
    totalDays: 20,
    usedDays: 5,
    pendingDays: 3,
    remainingDays: 12,
    year: 2023
  },
  {
    id: 'balance-5',
    employeeId: 'user-3',
    leaveTypeId: 'leave-type-2',
    leaveTypeName: 'Sick Leave',
    totalDays: 10,
    usedDays: 2,
    pendingDays: 0,
    remainingDays: 8,
    year: 2023
  },
  // Emily Davis
  {
    id: 'balance-6',
    employeeId: 'user-4',
    leaveTypeId: 'leave-type-1',
    leaveTypeName: 'Annual Leave',
    totalDays: 20,
    usedDays: 10,
    pendingDays: 0,
    remainingDays: 10,
    year: 2023
  },
  // Michael Johnson
  {
    id: 'balance-7',
    employeeId: 'user-5',
    leaveTypeId: 'leave-type-1',
    leaveTypeName: 'Annual Leave',
    totalDays: 20,
    usedDays: 12,
    pendingDays: 5,
    remainingDays: 3,
    year: 2023
  }
];

// Mock leave requests
export const mockLeaveRequests: LeaveRequest[] = [
  // Jane Employee
  {
    id: 'request-1',
    employeeId: 'user-2',
    employeeName: 'Jane Employee',
    department: 'Engineering',
    leaveType: 'Annual Leave',
    startDate: '2023-06-10T00:00:00.000Z',
    endDate: '2023-06-17T00:00:00.000Z',
    duration: 8,
    reason: 'Family vacation',
    status: 'approved',
    appliedOn: '2023-05-20T10:30:00.000Z',
    reviewedBy: 'John Admin',
    reviewedOn: '2023-05-22T14:15:00.000Z',
    comments: 'Approved. Enjoy your vacation!'
  },
  {
    id: 'request-2',
    employeeId: 'user-2',
    employeeName: 'Jane Employee',
    department: 'Engineering',
    leaveType: 'Sick Leave',
    startDate: '2023-07-05T00:00:00.000Z',
    endDate: '2023-07-07T00:00:00.000Z',
    duration: 3,
    reason: 'Flu and fever',
    status: 'approved',
    appliedOn: '2023-07-05T08:00:00.000Z',
    reviewedBy: 'John Admin',
    reviewedOn: '2023-07-05T09:30:00.000Z',
    comments: 'Get well soon'
  },
  {
    id: 'request-3',
    employeeId: 'user-2',
    employeeName: 'Jane Employee',
    department: 'Engineering',
    leaveType: 'Personal Leave',
    startDate: '2023-08-15T00:00:00.000Z',
    endDate: '2023-08-15T00:00:00.000Z',
    duration: 1,
    reason: 'Personal appointment',
    status: 'approved',
    appliedOn: '2023-08-10T16:45:00.000Z',
    reviewedBy: 'John Admin',
    reviewedOn: '2023-08-11T10:20:00.000Z'
  },
  {
    id: 'request-4',
    employeeId: 'user-2',
    employeeName: 'Jane Employee',
    department: 'Engineering',
    leaveType: 'Annual Leave',
    startDate: '2023-12-20T00:00:00.000Z',
    endDate: '2023-12-31T00:00:00.000Z',
    duration: 12,
    reason: 'Christmas holidays',
    status: 'pending',
    appliedOn: '2023-11-15T11:30:00.000Z'
  },
  // Robert Smith
  {
    id: 'request-5',
    employeeId: 'user-3',
    employeeName: 'Robert Smith',
    department: 'Marketing',
    leaveType: 'Annual Leave',
    startDate: '2023-08-21T00:00:00.000Z',
    endDate: '2023-08-25T00:00:00.000Z',
    duration: 5,
    reason: 'Summer break',
    status: 'approved',
    appliedOn: '2023-07-25T09:15:00.000Z',
    reviewedBy: 'John Admin',
    reviewedOn: '2023-07-26T14:00:00.000Z'
  },
  {
    id: 'request-6',
    employeeId: 'user-3',
    employeeName: 'Robert Smith',
    department: 'Marketing',
    leaveType: 'Sick Leave',
    startDate: '2023-09-18T00:00:00.000Z',
    endDate: '2023-09-19T00:00:00.000Z',
    duration: 2,
    reason: 'Migraine',
    status: 'approved',
    appliedOn: '2023-09-18T07:30:00.000Z',
    reviewedBy: 'John Admin',
    reviewedOn: '2023-09-18T08:45:00.000Z'
  },
  {
    id: 'request-7',
    employeeId: 'user-3',
    employeeName: 'Robert Smith',
    department: 'Marketing',
    leaveType: 'Annual Leave',
    startDate: '2023-11-23T00:00:00.000Z',
    endDate: '2023-11-24T00:00:00.000Z',
    duration: 2,
    reason: 'Family event',
    status: 'rejected',
    appliedOn: '2023-11-10T15:20:00.000Z',
    reviewedBy: 'John Admin',
    reviewedOn: '2023-11-12T10:30:00.000Z',
    comments: 'Critical marketing campaign launching that week. Please reschedule.'
  },
  {
    id: 'request-8',
    employeeId: 'user-3',
    employeeName: 'Robert Smith',
    department: 'Marketing',
    leaveType: 'Annual Leave',
    startDate: '2023-12-27T00:00:00.000Z',
    endDate: '2023-12-29T00:00:00.000Z',
    duration: 3,
    reason: 'Year-end break',
    status: 'pending',
    appliedOn: '2023-11-30T11:45:00.000Z'
  },
  // Emily Davis
  {
    id: 'request-9',
    employeeId: 'user-4',
    employeeName: 'Emily Davis',
    department: 'Finance',
    leaveType: 'Annual Leave',
    startDate: '2023-07-17T00:00:00.000Z',
    endDate: '2023-07-28T00:00:00.000Z',
    duration: 10,
    reason: 'Summer vacation',
    status: 'approved',
    appliedOn: '2023-06-20T09:00:00.000Z',
    reviewedBy: 'John Admin',
    reviewedOn: '2023-06-22T11:15:00.000Z'
  },
  // Michael Johnson
  {
    id: 'request-10',
    employeeId: 'user-5',
    employeeName: 'Michael Johnson',
    department: 'Engineering',
    leaveType: 'Annual Leave',
    startDate: '2023-05-02T00:00:00.000Z',
    endDate: '2023-05-12T00:00:00.000Z',
    duration: 9,
    reason: 'Personal trip',
    status: 'approved',
    appliedOn: '2023-04-10T14:30:00.000Z',
    reviewedBy: 'John Admin',
    reviewedOn: '2023-04-12T10:45:00.000Z'
  },
  {
    id: 'request-11',
    employeeId: 'user-5',
    employeeName: 'Michael Johnson',
    department: 'Engineering',
    leaveType: 'Bereavement',
    startDate: '2023-10-10T00:00:00.000Z',
    endDate: '2023-10-14T00:00:00.000Z',
    duration: 5,
    reason: 'Family emergency',
    status: 'approved',
    appliedOn: '2023-10-09T18:20:00.000Z',
    reviewedBy: 'John Admin',
    reviewedOn: '2023-10-09T19:00:00.000Z',
    comments: 'Our condolences. Take the time you need.'
  },
  {
    id: 'request-12',
    employeeId: 'user-5',
    employeeName: 'Michael Johnson',
    department: 'Engineering',
    leaveType: 'Annual Leave',
    startDate: '2023-12-22T00:00:00.000Z',
    endDate: '2023-12-26T00:00:00.000Z',
    duration: 3,
    reason: 'Christmas holiday',
    status: 'pending',
    appliedOn: '2023-11-25T10:30:00.000Z'
  }
];

// Mock departments
export const mockDepartments = [
  'Engineering',
  'Marketing',
  'Finance',
  'Human Resources',
  'Sales',
  'Operations',
  'Customer Support',
  'Research & Development',
  'Legal',
  'Product Management'
];

// Mock positions
export const mockPositions = [
  'Software Engineer',
  'Product Designer',
  'Marketing Specialist',
  'Financial Analyst',
  'HR Manager',
  'Sales Representative',
  'Operations Manager',
  'Customer Support Agent',
  'Research Scientist',
  'Legal Counsel',
  'Product Manager',
  'Data Analyst',
  'Project Manager',
  'Content Writer',
  'System Administrator'
];