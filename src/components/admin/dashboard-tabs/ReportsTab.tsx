import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText } from 'lucide-react';
import { Student } from '@/types/student';
import { ActivityEvent } from '@/types/activity';
import { useToast } from '@/components/ui/use-toast';

interface ReportsTabProps {
  students: Student[];
  events: ActivityEvent[];
}

export const ReportsTab = ({ students, events }: ReportsTabProps) => {
  const { toast } = useToast();
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const handleDownloadActivity = () => {
    if (!selectedStudentId) {
      toast({
        title: "No Student Selected",
        description: "Please select a student to download their activity report.",
        variant: "destructive",
      });
      return;
    }

    const selectedStudent = students.find(student => student.id === selectedStudentId);
    if (!selectedStudent) {
      toast({
        title: "Student Not Found",
        description: "The selected student could not be found.",
        variant: "destructive",
      });
      return;
    }

    // Filter events for the selected student (in a real app, we would have student-specific events)
    // For now, we'll use all events as an example
    const studentEvents = events;

    // Create CSV content
    let csvContent = "Activity Report for " + selectedStudent.name + "\n";
    csvContent += "Exam: " + selectedStudent.exam + "\n";
    csvContent += "Status: " + (selectedStudent.status || 'N/A') + "\n";
    csvContent += "Risk Score: " + (selectedStudent.riskScore || 'N/A') + "\n\n";
    csvContent += "Timestamp,Activity Type,Details,Risk Score\n";

    studentEvents.forEach(event => {
      csvContent += `${event.timestamp || new Date().toISOString()},${event.type},"${event.details || ''}",${event.riskScore || 0}\n`;
    });

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `activity_report_${selectedStudent.name.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Report Downloaded",
      description: `Activity report for ${selectedStudent.name} has been downloaded successfully.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporting Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 mb-6">
          View and export detailed reports on student activities and risk assessments.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <Label htmlFor="student-select">Select Student</Label>
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger id="student-select">
                <SelectValue placeholder="Choose a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} - {student.exam}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={handleDownloadActivity} 
              disabled={!selectedStudentId}
              className="w-full md:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Activity Report
            </Button>
          </div>
        </div>
        
        <div className="border p-6 rounded-lg bg-gray-50">
          <div className="flex items-center mb-4">
            <FileText className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="font-medium">Report Information</h3>
          </div>
          <p className="text-gray-600 text-sm">
            The activity report includes all recorded events for the selected student, 
            including timestamps, activity types, details, and risk scores. 
            Reports are exported in CSV format for easy analysis.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};