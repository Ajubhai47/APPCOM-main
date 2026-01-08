
import { useEffect, useState } from 'react';
import { ActivityEvent } from '@/types/activity';

export function useDatasetMonitoring(
  isMonitoring: boolean,
  useDataset: boolean,
  datasetEvents: ActivityEvent[]
) {
  const [currentDatasetIndex, setCurrentDatasetIndex] = useState(0);
  const [datasetEvent, setDatasetEvent] = useState<ActivityEvent | null>(null);

  // Set up monitoring with dataset events
  useEffect(() => {
    if (!isMonitoring || !useDataset || datasetEvents.length === 0) {
      setDatasetEvent(null);
      return;
    }
    
    // Use dataset events at intervals when monitoring with dataset
    const interval = setInterval(() => {
      if (currentDatasetIndex < datasetEvents.length) {
        const event = datasetEvents[currentDatasetIndex];
        setDatasetEvent(event);
        setCurrentDatasetIndex(prev => prev + 1);
      } else {
        // Loop back to beginning if we've used all events
        setCurrentDatasetIndex(0);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isMonitoring, useDataset, datasetEvents, currentDatasetIndex]);

  return { datasetEvent, resetIndex: () => setCurrentDatasetIndex(0) };
}
