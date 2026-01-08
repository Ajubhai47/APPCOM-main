import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Clock, Users } from 'lucide-react';
import { StudentList } from '@/components/StudentList';
import { Student } from '@/types/student';

interface RiskDistribution {
  low: number;
  medium: number;
  high: number;
}

interface OverviewTabProps {
  stats: {
    activeStudents: number;
    averageRiskScore: number;
    flaggedSessions: number;
    totalSessions: number;
  };
  riskDistribution: RiskDistribution;
  students: Student[];
}

export const OverviewTab = ({ stats, riskDistribution, students }: OverviewTabProps) => {
  // Calculate total for risk distribution to avoid division by zero
  const totalStudents = stats.activeStudents > 0 ? stats.activeStudents : 1;
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">ACTIVE STUDENTS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{stats.activeStudents}</span>
              <Users size={20} className="text-ethicproc-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Currently taking exams</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">AVG. RISK SCORE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{stats.averageRiskScore.toFixed(0)}%</span>
              <AlertTriangle size={20} className="text-yellow-500" />
            </div>
            <Progress value={stats.averageRiskScore} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">FLAGGED SESSIONS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{stats.flaggedSessions}</span>
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">High risk sessions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">TOTAL SESSIONS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{stats.totalSessions}</span>
              <Clock size={20} className="text-gray-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Past 24 hours</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Student Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                {students.length > 0 ? (
                  <StudentList students={students} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No students added yet</p>
                    <p className="text-sm mt-2">Add students through the Students tab to see them here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">Low Risk</span>
                    <span className="text-sm font-medium text-green-500">
                      {riskDistribution.low} students
                    </span>
                  </div>
                  <Progress value={(riskDistribution.low / totalStudents) * 100} className="h-2 bg-gray-200" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">Medium Risk</span>
                    <span className="text-sm font-medium text-yellow-500">
                      {riskDistribution.medium} students
                    </span>
                  </div>
                  <Progress value={(riskDistribution.medium / totalStudents) * 100} className="h-2 bg-gray-200" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">High Risk</span>
                    <span className="text-sm font-medium text-red-500">
                      {riskDistribution.high} students
                    </span>
                  </div>
                  <Progress value={(riskDistribution.high / totalStudents) * 100} className="h-2 bg-gray-200" />
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-medium mb-2">Risk Factors</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    Frequent tab switching
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    Copy/paste attempts
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                    Unusual mouse movements
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                    Irregular typing patterns
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};