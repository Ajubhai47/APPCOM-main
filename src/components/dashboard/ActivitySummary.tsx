
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ActivityType } from '@/types/activity';

interface ActivitySummaryProps {
  examStarted: boolean;
  totalEvents: number;
  addTestEvent: (type: ActivityType, details?: string) => void;
}

export const ActivitySummary = ({ examStarted, totalEvents, addTestEvent }: ActivitySummaryProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">ACTIVITY SUMMARY</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">{totalEvents}</span>
          <span className="px-2 py-1 bg-ethicproc-100 text-ethicproc-700 rounded-md text-sm">
            {examStarted ? 'Monitoring Active' : 'Not Monitoring'}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Total activities detected during this session
        </p>
        
        {examStarted && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button 
              variant="outline" 
              className="text-xs h-auto py-1"
              onClick={() => addTestEvent('Tab Switch')}
            >
              Tab Switch
            </Button>
            <Button 
              variant="outline" 
              className="text-xs h-auto py-1"
              onClick={() => addTestEvent('Copy Attempt')}
            >
              Copy Event
            </Button>
            <Button 
              variant="outline" 
              className="text-xs h-auto py-1"
              onClick={() => addTestEvent('Focus Change')}
            >
              Focus Change
            </Button>
            <Button 
              variant="outline" 
              className="text-xs h-auto py-1"
              onClick={() => addTestEvent('Mouse Movement', 'High frequency movement detected: 350 movements/sec')}
            >
              High Mouse Activity
            </Button>
            <Button 
              variant="outline" 
              className="text-xs h-auto py-1"
              onClick={() => addTestEvent('Keyboard Activity', 'High frequency typing detected: 45 keystrokes in 5 seconds')}
            >
              High Keyboard Activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
