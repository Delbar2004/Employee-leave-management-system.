import { Briefcase } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="flex flex-col items-center">
        <div className="text-primary-600 dark:text-primary-400 animate-pulse mb-4">
          <Briefcase size={48} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          TimeOff
        </h1>
        <div className="mt-4 flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;