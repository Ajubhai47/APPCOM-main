
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DatasetImport } from '@/components/DatasetImport';
import { Database } from 'lucide-react';

interface DatasetTabProps {
  useDataset: boolean;
  toggleDatasetUse: () => void;
}

export const DatasetTab = ({ useDataset, toggleDatasetUse }: DatasetTabProps) => {
  return (
    <>
      <DatasetImport />
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Dataset Information</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleDatasetUse}
                className="flex items-center gap-1"
              >
                <Database size={14} />
                {useDataset ? 'Switch to Simulated Data' : 'Use Imported Dataset'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Data Mode</p>
                  <p className="text-lg font-medium">{useDataset ? 'Using Imported Dataset' : 'Using Simulated Data'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Activity Types</p>
                  <p className="text-lg font-medium">
                    Keyboard, Mouse, Tab, Copy/Paste
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Risk Analysis</p>
                  <p className="text-lg font-medium">ML-Based Scoring</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Dataset Format Requirements</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Your dataset should be in JSON or CSV format with the following structure:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium mb-1">JSON Format Example:</p>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
{`[
  {
    "timestamp": "2025-05-20T14:30:00Z",
    "type": "Keyboard Activity",
    "details": "Rapid typing detected",
    "riskScore": 25
  },
  {
    "timestamp": "2025-05-20T14:32:10Z",
    "type": "Tab Switch",
    "details": "Switched to external site",
    "riskScore": 65
  }
]`}
                    </pre>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium mb-1">CSV Format Example:</p>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
{`timestamp,type,details,riskScore
2025-05-20T14:30:00Z,Keyboard Activity,Rapid typing detected,25
2025-05-20T14:32:10Z,Tab Switch,Switched to external site,65
2025-05-20T14:35:45Z,Copy Attempt,Attempted to copy exam content,78`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
