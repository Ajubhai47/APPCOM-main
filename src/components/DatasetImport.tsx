import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileCheck, AlertCircle, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useActivity } from '@/contexts/ActivityContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const DatasetImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [datasets, setDatasets] = useState<{id: string, name: string}[]>([
    { id: '1', name: 'Exam Session Dataset #1 (Mock)' },
    { id: '2', name: 'Mouse Activity Dataset (Mock)' },
    { id: '3', name: 'Keystroke Patterns (Mock)' },
  ]);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const { toast } = useToast();
  const { importDataset } = useActivity();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleDatasetSelect = (value: string) => {
    setSelectedDataset(value);
  };
  
  const handleImportFromMockData = async () => {
    if (!selectedDataset) {
      toast({
        title: "No dataset selected",
        description: "Please select a dataset from the dropdown",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setProgress(10);
    
    try {
      // Simulate loading progress
      setProgress(50);
      
      // Create mock data
      const mockData = Array(20).fill(null).map((_, i) => ({
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        type: ['Focus Change', 'Mouse Movement', 'Keyboard Activity', 'Tab Switch', 'Copy Attempt'][Math.floor(Math.random() * 5)],
        details: `Activity from mock dataset ${selectedDataset}`,
        riskScore: Math.floor(Math.random() * 100)
      }));
      
      setProgress(90);
      
      // Import the mock dataset
      importDataset(mockData);
      
      setProgress(100);
      
      toast({
        title: "Dataset imported from mock data",
        description: `Successfully imported ${mockData.length} activity records`,
      });
    } catch (error) {
      console.error('Mock data import error:', error);
      
      // Fallback to mock data if there was an error
      const mockData = Array(20).fill(null).map((_, i) => ({
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        type: ['Focus Change', 'Mouse Movement', 'Keyboard Activity', 'Tab Switch', 'Copy Attempt'][Math.floor(Math.random() * 5)],
        details: `Activity from mock dataset ${selectedDataset} (Fallback)`,
        riskScore: Math.floor(Math.random() * 100)
      }));
      
      // Import the mock dataset
      importDataset(mockData);
      
      toast({
        title: "Using mock data",
        description: "Failed to import. Using mock data instead.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };
  
  const handleImportFromFile = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a dataset file to import",
        variant: "destructive",
      });
      return;
    }
    
    // Check if file is JSON or CSV
    if (!file.name.endsWith('.json') && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file format",
        description: "Please upload a JSON or CSV file",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Start reading file
      const reader = new FileReader();
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      };
      
      reader.onload = async (e) => {
        try {
          let data;
          
          // Parse file based on type
          if (file.name.endsWith('.json')) {
            data = JSON.parse(e.target?.result as string);
          } else {
            // Simple CSV parsing (in a real app, you might want a more robust CSV parser)
            const text = e.target?.result as string;
            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());
            data = lines.slice(1).map(line => {
              const values = line.split(',').map(v => v.trim());
              const obj: any = {};
              headers.forEach((header, index) => {
                obj[header] = values[index];
              });
              return obj;
            });
          }
          
          // Transform data to match ActivityEvent format
          const formattedData = data.slice(0, 50).map((record: any, index: number) => {
            const now = new Date();
            now.setMinutes(now.getMinutes() - index);
            
            // Try to extract relevant fields or use defaults
            const type = record.type || record.event_type || record.activity_type || 
                         ['Focus Change', 'Mouse Movement', 'Keyboard Activity', 'Tab Switch', 'Copy Attempt'][Math.floor(Math.random() * 5)];
            
            const riskScore = record.riskScore !== undefined ? 
                              parseInt(record.riskScore) : 
                              (record.risk_score !== undefined ? parseInt(record.risk_score) : Math.floor(Math.random() * 100));
            
            return {
              timestamp: record.timestamp || record.date || now.toISOString(),
              type,
              details: record.details || record.description || `${type} activity`,
              riskScore
            };
          });
          
          setProgress(90);
          
          // Import the dataset
          importDataset(formattedData);
          
          setProgress(100);
          
          toast({
            title: "Dataset imported from file",
            description: `Successfully imported ${formattedData.length} activity records`,
          });
        } catch (error) {
          console.error('File import error:', error);
          toast({
            title: "Import failed",
            description: "Failed to parse the dataset file",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
          setTimeout(() => setProgress(0), 1000);
        }
      };
      
      reader.onerror = () => {
        toast({
          title: "Error reading file",
          description: "Could not read the dataset file",
          variant: "destructive",
        });
        setIsLoading(false);
        setProgress(0);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "Failed to import dataset",
        variant: "destructive",
      });
      setIsLoading(false);
      setProgress(0);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload size={18} /> Import Activity Dataset
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Mock Dataset Selection */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-sm font-medium flex items-center gap-2 mb-4">
              <Database size={16} className="text-ethicproc-700" />
              Import from Mock Data
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-500">Select Dataset</label>
                <Select 
                  value={selectedDataset} 
                  onValueChange={handleDatasetSelect}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a dataset" />
                  </SelectTrigger>
                  <SelectContent>
                    {datasets.map(dataset => (
                      <SelectItem key={dataset.id} value={dataset.id}>
                        {dataset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleImportFromMockData}
                disabled={!selectedDataset || isLoading}
                className="bg-ethicproc-700 hover:bg-ethicproc-800 w-full"
              >
                {isLoading ? 'Importing...' : 'Import from Mock Data'}
              </Button>
            </div>
          </div>
          
          {/* Local File Upload */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium flex items-center gap-2 mb-4">
              <Upload size={16} /> Import from Local File
            </h3>
            
            <div className="flex items-center justify-center w-full">
              <label 
                htmlFor="dataset-upload" 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {file ? (
                    <>
                      <FileCheck className="w-8 h-8 mb-2 text-ethicproc-700" />
                      <p className="text-sm text-ethicproc-700 font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">JSON or CSV (MAX. 10MB)</p>
                    </>
                  )}
                </div>
                <input 
                  id="dataset-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".json,.csv"
                />
              </label>
            </div>
            
            {progress > 0 && (
              <div className="mt-4">
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-gray-500 text-center mt-1">{progress}%</p>
              </div>
            )}
            
            <Button 
              onClick={handleImportFromFile}
              disabled={!file || isLoading}
              className="bg-ethicproc-700 hover:bg-ethicproc-800 w-full mt-4"
            >
              {isLoading ? 'Importing...' : 'Import from File'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};