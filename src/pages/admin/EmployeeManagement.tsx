import { useState, useEffect } from 'react';
import { Search, Filter, Plus, User, ChevronDown, ChevronUp, X, RefreshCw, MoreHorizontal, Calendar, PencilLine, Trash2 } from 'lucide-react';
import { mockUsers, mockDepartments, mockPositions } from '../../data/mockData';
import { User as UserType } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<UserType[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<UserType | null>(null);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    role: '',
    searchTerm: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee',
    department: '',
    position: '',
    joinDate: ''
  });
  
  useEffect(() => {
    // Simulate fetching employees
    const fetchEmployees = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setEmployees(mockUsers);
        setFilteredEmployees(mockUsers);
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast.error('Failed to load employees');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);
  
  useEffect(() => {
    // Apply filters
    let result = [...employees];
    
    if (filters.department) {
      result = result.filter(employee => employee.department === filters.department);
    }
    
    if (filters.role) {
      result = result.filter(employee => employee.role === filters.role);
    }
    
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      result = result.filter(
        employee => 
          employee.name.toLowerCase().includes(searchTerm) ||
          employee.email.toLowerCase().includes(searchTerm) ||
          (employee.department && employee.department.toLowerCase().includes(searchTerm)) ||
          (employee.position && employee.position.toLowerCase().includes(searchTerm))
      );
    }
    
    setFilteredEmployees(result);
  }, [filters, employees]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const resetFilters = () => {
    setFilters({
      department: '',
      role: '',
      searchTerm: ''
    });
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddEmployee = () => {
    setFormData({
      name: '',
      email: '',
      role: 'employee',
      department: '',
      position: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
    setIsAddingEmployee(true);
    setSelectedEmployee(null);
  };
  
  const handleEditEmployee = (employee: UserType) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department || '',
      position: employee.position || '',
      joinDate: employee.joinDate ? new Date(employee.joinDate).toISOString().split('T')[0] : ''
    });
    setSelectedEmployee(employee);
    setIsEditingEmployee(true);
  };
  
  const handleSubmitEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (isAddingEmployee) {
      // Add new employee
      const newEmployee: UserType = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role as 'admin' | 'employee',
        department: formData.department,
        position: formData.position,
        joinDate: formData.joinDate,
      };
      
      setEmployees([...employees, newEmployee]);
      toast.success('Employee added successfully');
    } else if (isEditingEmployee && selectedEmployee) {
      // Update existing employee
      const updatedEmployees = employees.map(emp => 
        emp.id === selectedEmployee.id 
          ? { 
              ...emp, 
              name: formData.name,
              email: formData.email,
              role: formData.role as 'admin' | 'employee',
              department: formData.department,
              position: formData.position,
              joinDate: formData.joinDate
            } 
          : emp
      );
      
      setEmployees(updatedEmployees);
      toast.success('Employee updated successfully');
    }
    
    // Reset form and state
    setIsAddingEmployee(false);
    setIsEditingEmployee(false);
    setSelectedEmployee(null);
  };
  
  const handleDeleteEmployee = (employeeId: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
      setEmployees(updatedEmployees);
      
      if (selectedEmployee && selectedEmployee.id === employeeId) {
        setSelectedEmployee(null);
      }
      
      toast.success('Employee deleted successfully');
    }
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage employees and their information
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
            placeholder="Search employees..."
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
            onClick={() => {
              setEmployees([...mockUsers]);
              setFilteredEmployees([...mockUsers]);
            }}
            className="btn btn-outline px-3 py-2"
            aria-label="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          
          <button
            onClick={handleAddEmployee}
            className="btn btn-primary px-3 py-2"
          >
            <Plus size={16} className="mr-2" />
            Add Employee
          </button>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="card mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label htmlFor="role" className="label">Role</label>
              <select
                id="role"
                name="role"
                className="input"
                value={filters.role}
                onChange={handleFilterChange}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
              </select>
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
      
      {/* Employee list and details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Employees 
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({filteredEmployees.length})
                </span>
              </h2>
            </div>
            
            {filteredEmployees.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Employee
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Department
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Position
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredEmployees.map((employee) => (
                      <tr 
                        key={employee.id} 
                        className={`hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                          selectedEmployee?.id === employee.id ? 'bg-gray-50 dark:bg-gray-750' : ''
                        }`}
                        onClick={() => setSelectedEmployee(employee)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                              {employee.avatar ? (
                                <img 
                                  src={employee.avatar} 
                                  alt={employee.name} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <User size={16} className="text-gray-600 dark:text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {employee.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {employee.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {employee.department || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {employee.position || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge ${
                            employee.role === 'admin' 
                              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300' 
                              : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300'
                          } capitalize`}>
                            {employee.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditEmployee(employee);
                            }}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                          >
                            <PencilLine size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEmployee(employee.id);
                            }}
                            className="text-error-600 hover:text-error-900 dark:text-error-400 dark:hover:text-error-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <User size={24} className="text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No employees found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {filters.department || filters.role || filters.searchTerm
                    ? 'Try adjusting your filters to see more results'
                    : 'Add new employees to get started'}
                </p>
                {(filters.department || filters.role || filters.searchTerm) ? (
                  <button
                    onClick={resetFilters}
                    className="btn btn-outline mr-2"
                  >
                    Reset Filters
                  </button>
                ) : (
                  <button
                    onClick={handleAddEmployee}
                    className="btn btn-primary"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Employee
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Employee details or add/edit form */}
        <div>
          {isAddingEmployee || isEditingEmployee ? (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {isAddingEmployee ? 'Add New Employee' : 'Edit Employee'}
                </h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmitEmployee}>
                  <div className="space-y-4">
                    <div className="form-control">
                      <label htmlFor="name" className="label">
                        Full Name <span className="text-error-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="input"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    
                    <div className="form-control">
                      <label htmlFor="email" className="label">
                        Email Address <span className="text-error-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="input"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    
                    <div className="form-control">
                      <label htmlFor="role" className="label">
                        Role <span className="text-error-500">*</span>
                      </label>
                      <select
                        id="role"
                        name="role"
                        className="input"
                        value={formData.role}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label htmlFor="department" className="label">
                          Department
                        </label>
                        <select
                          id="department"
                          name="department"
                          className="input"
                          value={formData.department}
                          onChange={handleFormChange}
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
                          className="input"
                          value={formData.position}
                          onChange={handleFormChange}
                        >
                          <option value="">Select Position</option>
                          {mockPositions.map((pos) => (
                            <option key={pos} value={pos}>{pos}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-control">
                      <label htmlFor="joinDate" className="label">
                        Join Date
                      </label>
                      <input
                        type="date"
                        id="joinDate"
                        name="joinDate"
                        className="input"
                        value={formData.joinDate}
                        onChange={handleFormChange}
                      />
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingEmployee(false);
                          setIsEditingEmployee(false);
                        }}
                        className="btn btn-outline flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary flex-1"
                      >
                        {isAddingEmployee ? 'Add Employee' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : selectedEmployee ? (
            <div className="card">
              <div className="card-header flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Employee Details</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditEmployee(selectedEmployee)}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <PencilLine size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(selectedEmployee.id)}
                    className="text-error-600 hover:text-error-900 dark:text-error-400 dark:hover:text-error-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                    {selectedEmployee.avatar ? (
                      <img 
                        src={selectedEmployee.avatar} 
                        alt={selectedEmployee.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <User size={32} className="text-gray-600 dark:text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-medium text-gray-900 dark:text-white">{selectedEmployee.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedEmployee.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</h4>
                    <p className="mt-1 text-gray-900 dark:text-white">{selectedEmployee.department || '-'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Position</h4>
                    <p className="mt-1 text-gray-900 dark:text-white">{selectedEmployee.position || '-'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</h4>
                    <p className="mt-1">
                      <span className={`badge ${
                        selectedEmployee.role === 'admin' 
                          ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300' 
                          : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300'
                      } capitalize`}>
                        {selectedEmployee.role}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Join Date</h4>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {selectedEmployee.joinDate 
                        ? new Date(selectedEmployee.joinDate).toLocaleDateString() 
                        : '-'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-primary-500" />
                      Leave Overview
                    </div>
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Annual</span>
                      <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                        {selectedEmployee.id === 'user-2' ? '10/20' : selectedEmployee.id === 'user-3' ? '12/20' : '15/20'}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Sick</span>
                      <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                        {selectedEmployee.id === 'user-2' ? '7/10' : selectedEmployee.id === 'user-3' ? '8/10' : '6/10'}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Personal</span>
                      <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                        {selectedEmployee.id === 'user-2' ? '4/5' : selectedEmployee.id === 'user-3' ? '3/5' : '2/5'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <User size={24} className="text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No employee selected</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Select an employee to view details or add a new one
                </p>
                <button
                  onClick={handleAddEmployee}
                  className="btn btn-primary"
                >
                  <Plus size={16} className="mr-2" />
                  Add Employee
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;