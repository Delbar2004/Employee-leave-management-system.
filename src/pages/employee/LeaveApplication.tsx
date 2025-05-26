import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { format, differenceInBusinessDays, addDays, isWeekend, parse } from 'date-fns';
import { leaveService, LeaveType } from '../../services/leaveService';
import { toast } from 'react-toastify';

interface FormData {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

const LeaveApplication = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workingDays, setWorkingDays] = useState(0);
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    control,
    setValue,
    formState: { errors } 
  } = useForm<FormData>({
    defaultValues: {
      leaveType: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      reason: '',
    },
  });
  
  // Watch form values for date calculations
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const types = await leaveService.getLeaveTypes();
        setLeaveTypes(types);
      } catch (error) {
        console.error('Error fetching leave types:', error);
        toast.error('Failed to load leave types');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaveTypes();
  }, []);
  
  // Calculate working days between dates
  useEffect(() => {
    if (startDate && endDate) {
      try {
        const start = parse(startDate, 'yyyy-MM-dd', new Date());
        const end = parse(endDate, 'yyyy-MM-dd', new Date());
        
        if (start <= end) {
          // Add 1 to include both start and end dates
          const businessDays = calculateBusinessDays(start, end);
          setWorkingDays(businessDays);
        } else {
          setWorkingDays(0);
        }
      } catch (error) {
        console.error('Date calculation error:', error);
        setWorkingDays(0);
      }
    }
  }, [startDate, endDate]);
  
  // Function to calculate business days (excluding weekends)
  const calculateBusinessDays = (startDate: Date, endDate: Date): number => {
    let days = 0;
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      if (!isWeekend(currentDate)) {
        days++;
      }
      currentDate = addDays(currentDate, 1);
    }
    
    return days;
  };
  
  const onSubmit = async (data: FormData) => {
    if (workingDays <= 0) {
      toast.error('Please select valid dates with at least one working day');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await leaveService.applyForLeave(data);
      toast.success('Leave request submitted successfully');
      navigate('/leave/history');
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast.error('Failed to submit leave request');
    } finally {
      setIsSubmitting(false);
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
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Apply for Leave</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Fill out the form below to submit your leave request
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Leave Request Form</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div className="form-control">
                    <label htmlFor="leaveType" className="label">
                      Leave Type <span className="text-error-500">*</span>
                    </label>
                    <select
                      id="leaveType"
                      className="input"
                      {...register('leaveType', { required: 'Leave type is required' })}
                    >
                      <option value="">Select leave type</option>
                      {leaveTypes.map((type) => (
                        <option key={type.id} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    {errors.leaveType && (
                      <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                        {errors.leaveType.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label htmlFor="startDate" className="label">
                        Start Date <span className="text-error-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="startDate"
                          className="input pl-10"
                          min={format(new Date(), 'yyyy-MM-dd')}
                          {...register('startDate', { required: 'Start date is required' })}
                        />
                      </div>
                      {errors.startDate && (
                        <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                          {errors.startDate.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="form-control">
                      <label htmlFor="endDate" className="label">
                        End Date <span className="text-error-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="endDate"
                          className="input pl-10"
                          min={startDate || format(new Date(), 'yyyy-MM-dd')}
                          {...register('endDate', { required: 'End date is required' })}
                        />
                      </div>
                      {errors.endDate && (
                        <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                          {errors.endDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-control">
                    <label htmlFor="reason" className="label">
                      Reason for Leave <span className="text-error-500">*</span>
                    </label>
                    <textarea
                      id="reason"
                      rows={4}
                      className="input"
                      placeholder="Please provide details about your leave request"
                      {...register('reason', { 
                        required: 'Reason is required',
                        minLength: { value: 10, message: 'Reason should be at least 10 characters' }
                      })}
                    ></textarea>
                    {errors.reason && (
                      <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                        {errors.reason.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
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
                          Submitting...
                        </div>
                      ) : (
                        'Submit Request'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div>
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Request Summary</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="font-medium text-gray-900 dark:text-white flex items-center">
                    <Clock size={16} className="mr-1 text-primary-500" /> 
                    {workingDays} working day{workingDays !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">From:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {startDate ? format(new Date(startDate), 'MMM dd, yyyy') : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">To:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {endDate ? format(new Date(endDate), 'MMM dd, yyyy') : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {watch('leaveType') || '-'}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Status:</span>
                  <div className="mt-1 flex items-start space-x-2">
                    <div className="mt-0.5 text-accent-500">
                      <Clock size={16} />
                    </div>
                    <span className="text-accent-600 dark:text-accent-400">
                      Will be submitted as <strong>Pending</strong> for approval
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Information</h3>
            </div>
            <div className="card-body">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start space-x-2">
                  <div className="mt-0.5 text-primary-500">
                    <CheckCircle size={16} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Requests must be submitted at least 3 days in advance for proper planning.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="mt-0.5 text-primary-500">
                    <CheckCircle size={16} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Weekend days are automatically excluded from leave duration calculations.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="mt-0.5 text-primary-500">
                    <CheckCircle size={16} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    You will receive notifications when your request status changes.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="mt-0.5 text-error-500">
                    <AlertCircle size={16} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Please ensure you have sufficient leave balance before applying.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplication;