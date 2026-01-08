import { useState, useEffect } from 'react';
import { useActivity } from '@/contexts/ActivityContext';
import { useToast } from '@/components/ui/use-toast';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ExamTimer } from '@/components/dashboard/ExamTimer';
import { ActivitySummary } from '@/components/dashboard/ActivitySummary';
import { RiskDisplay } from '@/components/dashboard/RiskDisplay';
import { ExamTabContent } from '@/components/dashboard/ExamTabContent';
import { ApiService } from '@/services/apiService';

const StudentDashboard = () => {
  const {
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    events,
    totalRiskScore,
    riskLevel,
    totalEvents,
    addTestEvent,
    useDataset,
    consecutiveCopyAttempts,
    consecutiveFocusChanges,
    currentStudentId,
    setCurrentStudentId
  } = useActivity();

  const { toast } = useToast();
  const [examStarted, setExamStarted] = useState(false);

  // Set the current student ID when the component mounts
  useEffect(() => {
    // Get the student ID from local storage (set during login)
    const storedStudentId = localStorage.getItem('studentId');

    if (storedStudentId) {
      setCurrentStudentId(storedStudentId);
    } else {
      // If no student ID found, we should probably redirect to login
      // But for now, we'll keep the temp ID behavior if nothing in localStorage
      // to avoid breaking the app logic completely
      const tempStudentId = `student_${Date.now()}`;
      setCurrentStudentId(tempStudentId);
    }

    // Force offline status on mount (reset) or handle logic? 
    // Maybe not, we want to respect state.
    return () => {
      // Don't clear on unmount as we might navigate within the app
      // setCurrentStudentId(null); 
    };
  }, [setCurrentStudentId]);

  // Debug state
  const [lastSyncTime, setLastSyncTime] = useState<string>('Never');

  // Sync state to backend
  const handleTimeUpdate = (timeElapsedString: string) => {
    if (currentStudentId && !useDataset) {
      // We could debounce this or just send every few seconds. 
      // For now, let's store it locally and only send periodically via a separate effect, 
      // OR just throttle here.
      // Let's rely on a separate interval for sending updates to avoid spamming the network every second.
      // But capturing the value here is good.
      sessionStorage.setItem('currentTimeElapsed', timeElapsedString);
    }
  };

  const forceSync = async () => {
    if (!currentStudentId) return;
    try {
      const timeString = sessionStorage.getItem('currentTimeElapsed') || "00:00:00";
      await ApiService.updateStudentTimeElapsed(currentStudentId, timeString);
      await ApiService.updateStudentRiskScore(currentStudentId, totalRiskScore);
      setLastSyncTime(new Date().toLocaleTimeString());
      toast({ title: "Sync Triggered", description: `Sent time: ${timeString}` });
    } catch (e) {
      toast({ title: "Sync Failed", description: String(e), variant: "destructive" });
    }
  };

  // Periodic network sync
  useEffect(() => {
    // Only sync if exam is started and we have a student ID
    if (!currentStudentId || !examStarted || useDataset) return;

    const syncInterval = setInterval(async () => {
      try {
        // Retrieve latest time buffer
        const timeString = sessionStorage.getItem('currentTimeElapsed');

        // Only update if we have a valid time string (not null)
        if (timeString) {
          // Update Risk Score
          await ApiService.updateStudentRiskScore(currentStudentId, totalRiskScore);

          // Update Time Elapsed
          await ApiService.updateStudentTimeElapsed(currentStudentId, timeString);
          setLastSyncTime(new Date().toLocaleTimeString());
        }

      } catch (err) {
        console.error("Sync error:", err);
      }
    }, 5000); // Sync every 5 seconds

    return () => clearInterval(syncInterval);
  }, [currentStudentId, examStarted, useDataset, totalRiskScore]);


  const handleStartExam = async () => {
    setExamStarted(true);
    startMonitoring();
    if (currentStudentId && !useDataset) {
      try {
        await ApiService.updateStudentStatus(currentStudentId, 'active');
      } catch (e) {
        console.error('Failed to update start status', e);
      }
    }
  };

  const handleEndExam = async () => {
    setExamStarted(false);
    stopMonitoring();
    if (currentStudentId && !useDataset) {
      try {
        await ApiService.updateStudentStatus(currentStudentId, 'offline');
      } catch (e) {
        console.error('Failed to update end status', e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <DashboardHeader
        examStarted={examStarted}
        useDataset={useDataset}
      />

      <main className="container mx-auto px-4 pt-0 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ExamTimer
            examStarted={examStarted}
            startExam={handleStartExam}
            endExam={handleEndExam}
            onTimeUpdate={handleTimeUpdate}
          />

          <ActivitySummary
            examStarted={examStarted}
            totalEvents={totalEvents}
            addTestEvent={addTestEvent}
          />

          <RiskDisplay
            riskLevel={riskLevel}
            totalRiskScore={totalRiskScore}
            consecutiveCopyAttempts={consecutiveCopyAttempts}
            consecutiveFocusChanges={consecutiveFocusChanges}
          />
        </div>

        <ExamTabContent events={events} />

        {/* Debug Info Section */}
        <div className="mt-8 p-4 border rounded bg-gray-100 text-xs text-gray-600">
          <h3 className="font-bold mb-2">Debug Info</h3>
          <p><strong>Student ID:</strong> {currentStudentId || "None"}</p>
          <p><strong>Exam Started:</strong> {examStarted ? "Yes" : "No"}</p>
          <p><strong>Use Dataset:</strong> {useDataset ? "Yes" : "No"}</p>
          <p><strong>Last Sync:</strong> {lastSyncTime}</p>
          <button onClick={forceSync} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">Force Sync</button>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;