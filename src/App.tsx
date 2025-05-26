import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import LoadingScreen from './components/common/LoadingScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Lazy-loaded components
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const EmployeeDashboard = lazy(() => import('./pages/employee/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const LeaveApplication = lazy(() => import('./pages/employee/LeaveApplication'));
const LeaveHistory = lazy(() => import('./pages/employee/LeaveHistory'));
const LeaveBalance = lazy(() => import('./pages/employee/LeaveBalance'));
const LeaveRequests = lazy(() => import('./pages/admin/LeaveRequests'));
const EmployeeManagement = lazy(() => import('./pages/admin/EmployeeManagement'));
const Settings = lazy(() => import('./pages/common/Settings'));
const Profile = lazy(() => import('./pages/common/Profile'));
const NotFound = lazy(() => import('./pages/errors/NotFound'));

function App() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} />
          <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/" replace />} />
        </Route>
        
        {/* Protected Routes */}
        <Route element={<AppLayout />}>
          {/* Redirect based on user role */}
          <Route path="/" element={
            <ProtectedRoute>
              {user?.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/dashboard" replace />}
            </ProtectedRoute>
          } />
          
          {/* Employee Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
          <Route path="/leave/apply" element={<ProtectedRoute><LeaveApplication /></ProtectedRoute>} />
          <Route path="/leave/history" element={<ProtectedRoute><LeaveHistory /></ProtectedRoute>} />
          <Route path="/leave/balance" element={<ProtectedRoute><LeaveBalance /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/leave-requests" element={<AdminRoute><LeaveRequests /></AdminRoute>} />
          <Route path="/admin/employees" element={<AdminRoute><EmployeeManagement /></AdminRoute>} />
          
          {/* Common Routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Route>
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;