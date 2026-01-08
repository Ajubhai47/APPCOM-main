
import { useCallback } from 'react';
import { ActivityType, ActivityEvent } from '@/types/activity';
import { useToast } from '@/components/ui/use-toast';

export function useActivityGenerators() {
  const { toast } = useToast();

  // Add a new event
  const addEvent = useCallback((type: ActivityType, details?: string) => {
    // Generate risk score based on activity type (reduced by half for cumulative scoring)
    let riskScore = 2.5; // Default risk score (reduced from 5)
    
    switch (type) {
      case 'Tab Switch':
        riskScore = 7.5; // Reduced from 15
        break;
      case 'Copy Attempt':
        riskScore = 12.5; // Reduced from 25
        break;
      case 'Paste Attempt':
        riskScore = 15; // Reduced from 30
        break;
      case 'External Copy Detected':
        riskScore = 17.5; // Reduced from 35
        break;
      case 'Focus Change':
        riskScore = 5; // Reduced from 10
        break;
      case 'Mouse Movement':
        // Only assign risk score if it's high frequency movement (>300/sec)
        if (details && details.includes('High frequency')) {
          riskScore = 1.5; // Reduced from 3
        } else {
          riskScore = 0; // No risk for normal mouse movement
        }
        break;
      case 'Keyboard Activity':
        // Only assign risk score if it's high frequency typing (>40 keystrokes in 5 seconds)
        if (details && details.includes('High frequency')) {
          riskScore = 1; // Reduced from 2
        } else {
          riskScore = 0; // No risk for normal keyboard activity
        }
        break;
      case 'Session Started':
      case 'Session Ended':
        riskScore = 0;
        break;
    }

    // Add some randomness to the risk score for demo purposes (reduced range)
    const finalRiskScore = Math.min(100, Math.max(0, riskScore + (Math.random() * 10 - 5)));
    
    const newEvent: ActivityEvent = {
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date(),
      type,
      details,
      riskScore: finalRiskScore
    };
    
    // Show toast for high-risk events (adjusted threshold for reduced scores)
    if (finalRiskScore > 10) {
      toast({
        title: `${type} detected`,
        description: `Risk score: ${finalRiskScore.toFixed(1)}%`,
        variant: finalRiskScore > 15 ? "destructive" : "default",
      });
    }
    
    return newEvent;
  }, [toast]);

  return { addEvent };
}
