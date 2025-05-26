import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-200">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-error-100 dark:bg-error-900/30 p-4 rounded-full">
            <AlertTriangle size={48} className="text-error-600 dark:text-error-400" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline px-5 py-2.5 w-full sm:w-auto"
          >
            Go Back
          </button>
          <Link to="/" className="btn btn-primary px-5 py-2.5 w-full sm:w-auto">
            <Home size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;