export interface Student {
  id: string;
  name: string;
  exam: string;
  password?: string;
  timeElapsed?: string;
  riskScore?: number;
  status?: 'active' | 'flagged' | 'high-risk' | 'offline';
}