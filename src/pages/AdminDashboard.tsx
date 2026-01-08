import { useState, useEffect, useMemo } from 'react';
import { useActivity } from '@/contexts/ActivityContext';
import { useToast } from '@/components/ui/use-toast';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTabNavigation } from '@/components/admin/AdminTabNavigation';
import { Student } from '@/types/student';
import { ActivityEvent } from '@/types/activity';
import { ApiService } from '@/services/apiService';
import { allDemoStudents, addDemoStudent } from '@/data/demoStudents';

const AdminDashboard = () => {
  const { toast } = useToast();
  const {
    events,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    totalRiskScore,
    riskLevel,
    totalEvents,
    addTestEvent,
    useDataset,
    toggleDatasetUse,
    currentStudentId,
    setCurrentStudentId
  } = useActivity();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [useDemoMode, setUseDemoMode] = useState(false);
  const [adminEvents, setAdminEvents] = useState<ActivityEvent[]>([]);

  // Load students from API when component mounts and poll
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const studentsFromAPI = await ApiService.getAllStudents();
        setStudents(studentsFromAPI);
        setUseDemoMode(false);
      } catch (error) {
        console.error('Error loading students from API, using demo data:', error);
        // Only fallback to demo if we don't have students yet
        if (students.length === 0) {
          setStudents(allDemoStudents);
          setUseDemoMode(true);
          toast({
            title: "Demo Mode",
            description: "Using demo student data for demonstration purposes.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadStudents(); // Initial load
    const interval = setInterval(loadStudents, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Save activity events to database
  // Poll for activity events from database
  useEffect(() => {
    if (!useDemoMode) {
      const fetchEvents = async () => {
        try {
          const allEvents = await ApiService.getAllActivityEvents();
          // We need to map the API response to the expected ActivityEvent format if needed
          // For now, we assume the context manages local events, but for the ADMIN view, 
          // we might want to update the 'events' in the context or a local state 
          // so the dashboard reflects ALL students' activities.

          // However, the current AdminDashboard implementation reuses 'events' from useActivity() 
          // which is context-based. Ideally, admin should have its own state for ALL events.

          // IMPORTANT: The `useActivity` context is primarily for the CURRENT USER.
          // For Admin, we should probably bypass the context events for the global view.
          // Let's rely on the TabContent to fetch data, OR forward these events to the components.

          // For this fix, we will simply rely on the AdminTabNavigation components fetching data 
          // or if we want to update the context:
          // But context events are typed as simple ActivityEvent[], lacking studentName.

          // Let's just log that we are polling. The actual data consumption happens in the tabs.
          // Wait, the AdminTabNavigation takes `events` as a prop.
          // We should probably Fetch events here and pass them down instead of using context events.

          setAdminEvents(allEvents);

        } catch (error) {
          console.error('Polling error', error);
        }
      };

      const interval = setInterval(fetchEvents, 5000);
      fetchEvents(); // Initial fetch

      return () => clearInterval(interval);
    }
  }, [useDemoMode]);

  // Update student status and risk score based on activity events
  // NOTE: Disabled local optimistic updates to rely on backend polling for consistency
  /* 
  useEffect(() => {
    if (events.length > 0 && currentStudentId) {
      setStudents(prevStudents => {
        return prevStudents.map(student => {
          if (student.id === currentStudentId) {
             // ... logic ...
          }
          return student;
        });
      });
    }
  }, [events, currentStudentId, isMonitoring, totalRiskScore, useDemoMode]); 
  */

  // Calculate real-time statistics based on actual data
  const stats = useMemo(() => {
    // Count active students (those with active status)
    const activeStudents = students.filter(student => student.status === 'active').length;

    // Calculate average risk score from students with risk scores
    const studentsWithRisk = students.filter(student => student.riskScore !== undefined && student.riskScore > 0);
    const averageRiskScore = studentsWithRisk.length > 0
      ? studentsWithRisk.reduce((sum, student) => sum + (student.riskScore || 0), 0) / studentsWithRisk.length
      : 0;

    // Count flagged sessions (students with high-risk or flagged status)
    const flaggedSessions = students.filter(student =>
      student.status === 'high-risk' || student.status === 'flagged'
    ).length;

    // Total sessions is the total number of students
    const totalSessions = students.length;

    return {
      activeStudents,
      averageRiskScore,
      flaggedSessions,
      totalSessions
    };
  }, [students]);

  // Calculate real-time risk distribution
  const riskDistribution = useMemo(() => {
    const low = students.filter(student => student.status === 'active' && (student.riskScore || 0) < 30).length;
    const medium = students.filter(student => student.status === 'active' && (student.riskScore || 0) >= 30 && (student.riskScore || 0) < 70).length;
    const high = students.filter(student => student.status === 'high-risk' || student.status === 'flagged').length;

    return {
      low,
      medium,
      high
    };
  }, [students]);

  // Handle creating a new session
  const handleNewSession = () => {
    toast({
      title: "New session created",
      description: `Session has been created successfully.`,
    });
  };

  // Handle adding a new student
  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'status' | 'timeElapsed' | 'riskScore' | 'password'>) => {
    try {
      let newStudent: Student;

      if (useDemoMode) {
        // Add to demo data
        newStudent = addDemoStudent(studentData);
        setStudents([...allDemoStudents]);
        toast({
          title: "Student Added (Demo)",
          description: `${studentData.name} has been added to the student list (Demo Mode).`,
        });
      } else {
        // Create a new student in the database
        newStudent = await ApiService.createStudent(studentData);
        // Update local state
        setStudents(prev => [newStudent, ...prev]);
        toast({
          title: "Student Added",
          description: `${studentData.name} has been added to the student list.`,
        });
      }

      return newStudent;
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Error",
        description: "Failed to add student",
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="container mx-auto px-4 py-8">
        {loading && (
          <div className="text-center py-4">
            <p>Loading students...</p>
          </div>
        )}

        {useDemoMode && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Demo Mode:</strong> Using pre-loaded student data for demonstration purposes.
            </p>
          </div>
        )}

        <AdminTabNavigation
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          stats={stats}
          riskDistribution={riskDistribution}
          isMonitoring={isMonitoring}
          events={adminEvents} // Use fetched real-time events for Admin
          useDataset={useDataset}
          startMonitoring={startMonitoring}
          stopMonitoring={stopMonitoring}
          toggleDatasetUse={toggleDatasetUse}
          addTestEvent={addTestEvent}
          handleNewSession={handleNewSession}
          students={students}
          onAddStudent={handleAddStudent}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;