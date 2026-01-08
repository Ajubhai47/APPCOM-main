import { useCallback } from 'react';
import { ActivityEvent, DatasetActivityEvent, ActivityType } from '@/types/activity';

export function useDatasetActions(
  toast: any,
  setDatasetEvents: React.Dispatch<React.SetStateAction<ActivityEvent[]>>,
  setUseDataset: React.Dispatch<React.SetStateAction<boolean>>,
  datasetEvents: ActivityEvent[],
  useDataset: boolean
) {
  // Import dataset function
  const importDataset = useCallback((data: DatasetActivityEvent[]) => {
    if (!data || data.length === 0) {
      toast({
        title: "Empty dataset",
        description: "The imported dataset contains no valid records",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert imported data to ActivityEvent format
      const convertedEvents: ActivityEvent[] = data.map(item => ({
        id: Math.random().toString(36).substring(2, 11),
        timestamp: item.timestamp instanceof Date ? item.timestamp : new Date(item.timestamp),
        type: item.type as ActivityType,
        details: item.details,
        riskScore: item.riskScore || 0
      }));

      // Sort by timestamp (most recent first)
      convertedEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setDatasetEvents(convertedEvents);
      setUseDataset(true);
      
      toast({
        title: "Dataset ready",
        description: `${convertedEvents.length} events loaded. Switch to dataset mode to use them.`,
      });
    } catch (error) {
      console.error('Error processing dataset:', error);
      toast({
        title: "Dataset error",
        description: "Failed to process the imported dataset",
        variant: "destructive",
      });
    }
  }, [toast, setDatasetEvents, setUseDataset]);

  // Toggle between using dataset and generated events
  const toggleDatasetUse = useCallback(() => {
    if (!useDataset && datasetEvents.length === 0) {
      toast({
        title: "No dataset available",
        description: "Please import a dataset first",
        variant: "destructive",
      });
      return;
    }
    
    setUseDataset(prev => !prev);
    toast({
      title: useDataset ? "Using simulated data" : "Using imported dataset",
      description: useDataset 
        ? "Switched to generated activities mode" 
        : `Using ${datasetEvents.length} imported activities`,
    });
  }, [useDataset, datasetEvents.length, toast, setUseDataset]);

  return { importDataset, toggleDatasetUse };
}
