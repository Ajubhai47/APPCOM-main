
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityTimeline } from '@/components/ActivityTimeline';
import { ActivityEvent } from '@/types/activity';

interface ExamTabContentProps {
  events: ActivityEvent[];
}

export const ExamTabContent = ({ events }: ExamTabContentProps) => {
  return (
    <Tabs defaultValue="timeline">
      <TabsList className="mb-4">
        <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
        <TabsTrigger value="rules">Exam Rules</TabsTrigger>
      </TabsList>
      
      <TabsContent value="timeline" className="p-4 bg-white rounded-lg border border-gray-200">
        <h3 className="text-xl font-medium mb-4">Your Activity Timeline</h3>
        <ActivityTimeline events={events} />
      </TabsContent>
      
      <TabsContent value="rules" className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-xl font-medium mb-4">Exam Rules & Monitoring Information</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-ethicproc-700 mb-2">What is being monitored?</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Keyboard activity patterns (not actual keystrokes)</li>
              <li>Mouse movements and clicking patterns</li>
              <li>Tab switching frequency</li>
              <li>Copy and paste attempts</li>
              <li>Window focus changes</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-ethicproc-700 mb-2">What is NOT being monitored?</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your camera or microphone are not accessed</li>
              <li>The content you type is not recorded</li>
              <li>Your screen is not captured or recorded</li>
              <li>Your personal files are not accessed</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-ethicproc-700 mb-2">Rules for this exam</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Complete the exam within the allotted time</li>
              <li>Avoid excessive tab switching or application changes</li>
              <li>Do not attempt to copy content from other sources</li>
              <li>Stay focused on the exam window</li>
              <li>Do not attempt to communicate with others during the exam</li>
            </ul>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
