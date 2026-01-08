
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface AdminDashboardControlsProps {
  useDataset: boolean;
  toggleDatasetUse: () => void;
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  handleNewSession: () => void;
}

export const AdminDashboardControls = ({
  useDataset,
  toggleDatasetUse,
  isMonitoring,
  startMonitoring,
  stopMonitoring,
  handleNewSession
}: AdminDashboardControlsProps) => {
  return (
    <div className="flex gap-2">
      <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md mr-2">
        <Switch
          id="dataset-mode"
          checked={useDataset}
          onCheckedChange={toggleDatasetUse}
        />
        <Label htmlFor="dataset-mode" className="text-xs cursor-pointer">
          {useDataset ? 'Using Dataset' : 'Using Simulated Data'}
        </Label>
      </div>
      <Button 
        variant="outline" 
        onClick={() => isMonitoring ? stopMonitoring() : startMonitoring()}
        className={isMonitoring ? "border-red-500 text-red-500" : "border-green-500 text-green-500"}
      >
        {isMonitoring ? "Stop Demo" : "Start Demo"}
      </Button>
      <Button 
        className="bg-ethicproc-700 hover:bg-ethicproc-800"
        onClick={handleNewSession}
      >
        New Session
      </Button>
    </div>
  );
};
