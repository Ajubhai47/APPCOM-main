
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  examStarted: boolean;
  useDataset: boolean;
}

export const DashboardHeader = ({ examStarted, useDataset }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl md:text-2xl font-bold">
            <span className="text-gray-800">APP</span>
            <span className="text-ethicproc-700">COM</span>
          </h1>
          <span className="ml-4 px-2 py-1 bg-ethicproc-100 text-ethicproc-700 text-xs rounded-md">
            Student View
          </span>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-gray-600"
        >
          <ArrowLeft size={16} /> Exit
        </Button>
      </div>
      <div className="container mx-auto px-0 mt-8">
        <h2 className="text-2xl font-bold mb-2">Mock Exam Session</h2>
        <p className="text-gray-600">
          {examStarted
            ? "Your exam is in progress. Your activity is being monitored."
            : "Start your exam when you're ready. Your activity will be monitored for integrity."}
        </p>
        {useDataset && (
          <div className="mt-2 flex items-center text-sm text-ethicproc-700">
            <Database size={14} className="mr-1" />
            Using imported dataset for monitoring
          </div>
        )}
      </div>
    </header>
  );
};
