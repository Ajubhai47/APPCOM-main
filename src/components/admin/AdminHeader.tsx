
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminHeader = ({
  searchQuery,
  setSearchQuery
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void
}) => {
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
            Admin Panel
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search sessions or students..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-gray-600"
          >
            <ArrowLeft size={16} /> Exit
          </Button>
        </div>
      </div>
    </header>
  );
};
