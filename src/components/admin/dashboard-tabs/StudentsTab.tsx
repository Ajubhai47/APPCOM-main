import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StudentList } from '@/components/StudentList';
import { Search, Plus } from 'lucide-react';
import { Student } from '@/types/student';

interface StudentsTabProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id' | 'status' | 'timeElapsed' | 'riskScore'>) => void;
}

export const StudentsTab = ({ students, onAddStudent }: StudentsTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    exam: ''
  });

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.exam) {
      onAddStudent({
        name: newStudent.name,
        exam: newStudent.exam
      });
      setNewStudent({ name: '', exam: '' });
      setShowAddForm(false);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.exam.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search students..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            className="bg-ethicproc-700 hover:bg-ethicproc-800"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={16} className="mr-2" />
            Add Student
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Student</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Student Name</label>
                  <Input
                    placeholder="Enter student name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Exam</label>
                  <Input
                    placeholder="Enter exam name"
                    value={newStudent.exam}
                    onChange={(e) => setNewStudent({...newStudent, exam: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-ethicproc-700 hover:bg-ethicproc-800"
                  onClick={handleAddStudent}
                >
                  Add Student
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <StudentList extended students={filteredStudents} />
      </CardContent>
    </Card>
  );
};