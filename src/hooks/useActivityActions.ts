
import { useState, useCallback } from 'react';
import { ActivityEvent, ActivityType } from '@/types/activity';

export function useActivityActions(
  setEvents: React.Dispatch<React.SetStateAction<ActivityEvent[]>>,
  addEvent: (type: ActivityType, details?: string) => ActivityEvent
) {
  // Event handlers for real-time activity
  // Event handlers for real-time activity
  const handleAddEvent = useCallback(async (type: ActivityType, details?: string) => {
    const newEvent = addEvent(type, details);
    setEvents((prevEvents) => [newEvent, ...prevEvents]);

    // Send to API if we have a student ID
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      try {
        // Dynamically import ApiService to avoid circular dependencies if any
        const { ApiService } = await import('@/services/apiService');
        await ApiService.createActivityEvent({
          studentId,
          timestamp: newEvent.timestamp,
          type: newEvent.type,
          details: newEvent.details,
          riskScore: newEvent.riskScore
        });
      } catch (error) {
        console.error('Failed to log event to API:', error);
      }
    }
  }, [addEvent, setEvents]);

  // For demo purposes - add a test event
  const addTestEvent = useCallback((type: ActivityType, details?: string) => {
    handleAddEvent(type, details);
  }, [handleAddEvent]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, [setEvents]);

  return { handleAddEvent, clearEvents, addTestEvent };
}
