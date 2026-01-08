// Interface for ML model information
export interface MLModelInfo {
  id: string;
  name: string;
  createdAt: string;
  accuracy: number;
  status: 'training' | 'ready' | 'failed';
}

// Mock function to get ML model information
export async function getMLModels(): Promise<MLModelInfo[]> {
  // Return mock data since we're not using Supabase anymore
  return [
    {
      id: 'mock-1',
      name: 'Keystroke Anomaly Detector (Mock)',
      createdAt: new Date().toISOString(),
      accuracy: 0.92,
      status: 'ready'
    },
    {
      id: 'mock-2',
      name: 'Mouse Movement Analysis (Mock)',
      createdAt: new Date().toISOString(),
      accuracy: 0.85,
      status: 'ready'
    },
    {
      id: 'mock-3',
      name: 'Focus Pattern Detector (Mock)',
      createdAt: new Date().toISOString(),
      accuracy: 0.78,
      status: 'training'
    }
  ];
}