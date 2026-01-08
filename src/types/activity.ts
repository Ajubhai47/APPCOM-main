
export type ActivityType = 
  | 'Focus Change' 
  | 'Mouse Movement' 
  | 'Keyboard Activity' 
  | 'Tab Switch' 
  | 'Copy Attempt' 
  | 'Paste Attempt'
  | 'External Copy Detected'
  | 'Session Started'
  | 'Session Ended';

export interface ActivityEvent {
  id: string;
  timestamp: Date;
  type: ActivityType;
  details?: string;
  riskScore: number; // 0-100
}

export interface DatasetActivityEvent {
  timestamp: string | Date;
  type: string;
  details?: string;
  riskScore: number;
}
