import { ActivityTimeline } from '@/components/ActivityTimeline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityEvent } from '@/types/activity';

interface ExtendedActivityEvent extends ActivityEvent {
  studentName?: string;
  exam?: string;
}

interface LiveMonitoringTabProps {
  isMonitoring: boolean;
  events: ExtendedActivityEvent[];
  useDataset: boolean;
  addTestEvent: (type: string, details?: string) => void;
}

export const LiveMonitoringTab = ({
  isMonitoring,
  events,
  useDataset,
  addTestEvent
}: LiveMonitoringTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Live Activity Monitor</span>
          <div className="flex items-center">
            <span className="px-2 py-1 bg-ethicproc-100 text-ethicproc-700 rounded-md text-sm mr-3">
              {useDataset ? 'Using Dataset' : 'Using Simulated Data'}
            </span>
            <span className="px-2 py-1 bg-ethicproc-100 text-ethicproc-700 rounded-md text-sm">
              {isMonitoring ? 'Demo Active' : 'Demo Inactive'}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isMonitoring && (
          <div className="mb-6 flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              onClick={() => addTestEvent('Tab Switch')}
            >
              Simulate Tab Switch
            </Button>
            <Button 
              variant="outline" 
              onClick={() => addTestEvent('Copy Attempt')}
            >
              Simulate Copy Attempt
            </Button>
            <Button 
              variant="outline" 
              onClick={() => addTestEvent('Paste Attempt')}
            >
              Simulate Paste
            </Button>
            <Button 
              variant="outline" 
              onClick={() => addTestEvent('External Copy Detected')}
            >
              External Copy
            </Button>
            <Button 
              variant="outline" 
              onClick={() => addTestEvent('Focus Change')}
            >
              Simulate Focus Change
            </Button>
          </div>
        )}
        
        {!isMonitoring && (
          <div className="mb-6 p-4 border border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
            <p className="text-gray-500">Click "Start Demo" to begin monitoring and see simulation controls</p>
          </div>
        )}
        
        <ActivityTimeline events={events} showRiskScore />
      </CardContent>
    </Card>
  );
};