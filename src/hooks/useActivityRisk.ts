
import { useState, useEffect } from 'react';
import { ActivityEvent } from '@/types/activity';

export function useActivityRisk(events: ActivityEvent[]) {
  const [totalRiskScore, setTotalRiskScore] = useState(0);
  const [maxRiskScore, setMaxRiskScore] = useState(0); // Track maximum risk reached
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [consecutiveCopyAttempts, setConsecutiveCopyAttempts] = useState(0);
  const [consecutiveFocusChanges, setConsecutiveFocusChanges] = useState(0);
  
  // Count consecutive events of specific types
  useEffect(() => {
    if (events.length < 2) {
      setConsecutiveCopyAttempts(0);
      setConsecutiveFocusChanges(0);
      return;
    }
    
    // Check the most recent events (up to last 10) for patterns
    const recentEvents = events.slice(0, 10);
    
    // Count consecutive copy attempts (including external copies and paste attempts)
    let copyCount = 0;
    for (const event of recentEvents) {
      if (event.type === 'Copy Attempt' || event.type === 'Paste Attempt' || event.type === 'External Copy Detected') {
        copyCount++;
      } else {
        break; // Stop counting when we hit a different event type
      }
    }
    setConsecutiveCopyAttempts(copyCount);
    
    // Count consecutive focus changes
    let focusCount = 0;
    for (const event of recentEvents) {
      if (event.type === 'Focus Change') {
        focusCount++;
      } else {
        break; // Stop counting when we hit a different event type
      }
    }
    setConsecutiveFocusChanges(focusCount);
  }, [events]);

  // Calculate cumulative risk score whenever events change
  useEffect(() => {
    if (events.length === 0) {
      setTotalRiskScore(0);
      setMaxRiskScore(0);
      return;
    }
    
    // Calculate cumulative risk score from recent events (last 20 events to prevent unbounded growth)
    const recentEvents = events.slice(0, 20);
    let cumulativeRisk = recentEvents.reduce((sum, event) => sum + event.riskScore, 0);
    
    // Apply penalty for consecutive suspicious activities (reduced for lower base scores)
    const copyPenalty = Math.min(25, consecutiveCopyAttempts * 4); // Reduced from 8
    const focusPenalty = Math.min(15, consecutiveFocusChanges * 2); // Reduced from 4
    
    // Add penalties to cumulative score
    cumulativeRisk += copyPenalty + focusPenalty;
    
    // Apply decay factor to prevent score from growing indefinitely
    const decayFactor = 0.95; // Slight decay over time
    const decayedScore = cumulativeRisk * Math.pow(decayFactor, Math.max(0, events.length - 10));
    
    // Cap the score at 100 but make it cumulative
    const newRiskScore = Math.min(100, decayedScore);
    
    // Update total risk score (cumulative, doesn't drop unless events are cleared)
    setTotalRiskScore(Math.max(totalRiskScore, newRiskScore));
    
    // Track maximum risk reached
    setMaxRiskScore(prev => Math.max(prev, newRiskScore));
  }, [events, consecutiveCopyAttempts, consecutiveFocusChanges, totalRiskScore]);

  // Calculate risk level based on total risk score (adjusted thresholds for reduced scores)
  useEffect(() => {
    if (totalRiskScore < 25) {
      setRiskLevel('low');
    } else if (totalRiskScore < 75) {
      setRiskLevel('medium');
    } else {
      setRiskLevel('high');
    }
  }, [totalRiskScore]);

  return { 
    totalRiskScore, 
    maxRiskScore,
    riskLevel,
    consecutiveCopyAttempts,
    consecutiveFocusChanges
  };
}
