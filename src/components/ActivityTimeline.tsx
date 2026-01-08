import { format } from 'date-fns';
import { Eye, Keyboard, MousePointer, Clock, AlertCircle, Copy, MonitorPlay } from 'lucide-react';
import { ActivityEvent } from '@/contexts/ActivityContext';

interface ExtendedActivityEvent extends ActivityEvent {
  studentName?: string;
  exam?: string;
}

interface ActivityTimelineProps {
  events: ExtendedActivityEvent[];
  showRiskScore?: boolean;
  maxEvents?: number;
}

export const ActivityTimeline = ({ events, showRiskScore = false, maxEvents = 50 }: ActivityTimelineProps) => {
  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Focus Change':
        return <Eye className="text-ethicproc-600" size={18} />;
      case 'Mouse Movement':
        return <MousePointer className="text-ethicproc-600" size={18} />;
      case 'Keyboard Activity':
        return <Keyboard className="text-ethicproc-600" size={18} />;
      case 'Tab Switch':
        return <MonitorPlay className="text-ethicproc-600" size={18} />;
      case 'Copy Attempt':
      case 'Paste Attempt':
      case 'External Copy Detected':
        return <Copy className="text-ethicproc-600" size={18} />;
      case 'Session Started':
      case 'Session Ended':
        return <Clock className="text-ethicproc-600" size={18} />;
      default:
        return <AlertCircle className="text-ethicproc-600" size={18} />;
    }
  };
  
  // Get the background color based on risk score
  const getRiskBgColor = (riskScore: number) => {
    if (riskScore < 30) return 'bg-green-100 text-green-700';
    if (riskScore < 70) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };
  
  // Limit the number of events displayed to prevent performance issues
  const displayEvents = events.slice(0, maxEvents);
  
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No activities have been recorded yet.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {displayEvents.map((event) => (
        <div key={event.id} className="flex items-start border-b border-gray-100 pb-4 last:border-0">
          <div className="bg-ethicproc-100 rounded-full p-2 mr-4">
            {getActivityIcon(event.type)}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-medium">{event.type}</h4>
                {event.studentName && (
                  <p className="text-sm text-gray-600">
                    Student: {event.studentName} | Exam: {event.exam}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <time dateTime={event.timestamp.toISOString()}>
                  {format(event.timestamp, 'hh:mm:ss a')}
                </time>
                
                {showRiskScore && (
                  <span className={`px-2 py-0.5 rounded text-xs ${getRiskBgColor(event.riskScore)}`}>
                    {event.riskScore.toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
            
            {event.details && (
              <p className="text-sm text-gray-600 mt-1">{event.details}</p>
            )}
          </div>
        </div>
      ))}
      
      {events.length > maxEvents && (
        <div className="text-center text-sm text-gray-500">
          Showing {maxEvents} of {events.length} activities. More activities are being recorded.
        </div>
      )}
    </div>
  );
};