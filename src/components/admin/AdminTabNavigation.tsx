import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityEvent } from '@/types/activity';
import { ReactNode } from 'react';
import { OverviewTab } from './dashboard-tabs/OverviewTab';
import { LiveMonitoringTab } from './dashboard-tabs/LiveMonitoringTab';
import { DatasetTab } from './dashboard-tabs/DatasetTab';
import { StudentsTab } from './dashboard-tabs/StudentsTab';
import { ReportsTab } from './dashboard-tabs/ReportsTab';
import { AdminDashboardControls } from './AdminDashboardControls';
import { Student } from '@/types/student';

interface AdminTabNavigationProps {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
  stats: {
    activeStudents: number;
    averageRiskScore: number;
    flaggedSessions: number;
    totalSessions: number;
  };
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  isMonitoring: boolean;
  events: ActivityEvent[];
  useDataset: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  toggleDatasetUse: () => void;
  addTestEvent: (type: string, details?: string) => void;
  handleNewSession: () => void;
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
}

export const AdminTabNavigation = ({
  selectedTab,
  setSelectedTab,
  stats,
  riskDistribution,
  isMonitoring,
  events,
  useDataset,
  startMonitoring,
  stopMonitoring,
  toggleDatasetUse,
  addTestEvent,
  handleNewSession,
  students,
  onAddStudent
}: AdminTabNavigationProps) => {
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
      <div className="flex justify-between items-center mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="live">Live Monitoring</TabsTrigger>
          <TabsTrigger value="dataset">Dataset</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <AdminDashboardControls
          useDataset={useDataset}
          toggleDatasetUse={toggleDatasetUse}
          isMonitoring={isMonitoring}
          startMonitoring={startMonitoring}
          stopMonitoring={stopMonitoring}
          handleNewSession={handleNewSession}
        />
      </div>
      
      <TabsContent value="overview">
        <OverviewTab stats={stats} riskDistribution={riskDistribution} students={students} />
      </TabsContent>
      
      <TabsContent value="live">
        <LiveMonitoringTab 
          isMonitoring={isMonitoring} 
          events={events} 
          useDataset={useDataset}
          addTestEvent={addTestEvent}
        />
      </TabsContent>
      
      <TabsContent value="dataset">
        <DatasetTab useDataset={useDataset} toggleDatasetUse={toggleDatasetUse} />
      </TabsContent>
      
      <TabsContent value="students">
        <StudentsTab students={students} onAddStudent={onAddStudent} />
      </TabsContent>
      
      <TabsContent value="reports">
        <ReportsTab students={students} events={events} />
      </TabsContent>
    </Tabs>
  );
};