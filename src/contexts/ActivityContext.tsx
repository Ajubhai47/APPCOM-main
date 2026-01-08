import React, { createContext, useState, useEffect, useContext } from 'react';
import { ActivityEvent, ActivityType } from '@/types/activity';
import { useToast } from '@/components/ui/use-toast';
import { useActivityRisk } from '@/hooks/useActivityRisk';
import { useActivityGenerators } from '@/hooks/useActivityGenerators';
import { useRealTimeMonitoring } from '@/hooks/useRealTimeMonitoring';
import { useDatasetMonitoring } from '@/hooks/useDatasetMonitoring';
import { useActivityActions } from '@/hooks/useActivityActions';
import { useDatasetActions } from '@/hooks/useDatasetActions';
import { DatasetActivityEvent } from '@/types/activity';

interface ActivityContextType {
  events: ActivityEvent[];
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  totalRiskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  totalEvents: number;
  clearEvents: () => void;
  addTestEvent: (type: ActivityType, details?: string) => void;
  importDataset: (data: DatasetActivityEvent[]) => void;
  useDataset: boolean;
  toggleDatasetUse: () => void;
  consecutiveCopyAttempts: number;
  consecutiveFocusChanges: number;
  // Student-specific properties
  currentStudentId: string | null;
  setCurrentStudentId: (id: string | null) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [useDataset, setUseDataset] = useState(false);
  const [datasetEvents, setDatasetEvents] = useState<ActivityEvent[]>([]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const { toast } = useToast();

  // Use our custom hooks for risk assessment and event generation
  const { totalRiskScore, maxRiskScore, riskLevel, consecutiveCopyAttempts, consecutiveFocusChanges } = useActivityRisk(events);
  const { addEvent } = useActivityGenerators();

  // Handle events from the dataset monitoring hook
  const { datasetEvent } = useDatasetMonitoring(isMonitoring, useDataset, datasetEvents);
  
  // Add dataset event when available
  useEffect(() => {
    if (datasetEvent) {
      setEvents(prev => [datasetEvent, ...prev]);
    }
  }, [datasetEvent]);

  // Get our actions from custom hooks
  const { handleAddEvent, clearEvents, addTestEvent } = useActivityActions(setEvents, addEvent);
  const { importDataset: importDatasetFn, toggleDatasetUse: toggleDatasetUseFn } = 
    useDatasetActions(toast, setDatasetEvents, setUseDataset, datasetEvents, useDataset);

  // Setup real-time monitoring with a session flag to prevent multiple session started events
  useEffect(() => {
    if (isMonitoring && !sessionStarted && !useDataset) {
      handleAddEvent('Session Started', 'Real-time browser monitoring begun');
      setSessionStarted(true);
    } else if (!isMonitoring && sessionStarted) {
      setSessionStarted(false);
    }
  }, [isMonitoring, useDataset, sessionStarted, handleAddEvent]);
  
  // Setup real-time monitoring
  useRealTimeMonitoring(isMonitoring, useDataset, handleAddEvent);

  const startMonitoring = () => {
    if (isMonitoring) return;
    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    if (!isMonitoring) return;
    setIsMonitoring(false);
    handleAddEvent('Session Ended', 'Monitoring stopped');
  };

  const value = {
    events,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    totalRiskScore,
    riskLevel,
    totalEvents: events.length,
    clearEvents,
    addTestEvent,
    importDataset: importDatasetFn,
    useDataset,
    toggleDatasetUse: toggleDatasetUseFn,
    consecutiveCopyAttempts,
    consecutiveFocusChanges,
    currentStudentId,
    setCurrentStudentId
  };

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

export type { ActivityType, ActivityEvent, DatasetActivityEvent };