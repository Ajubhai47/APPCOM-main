import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Student } from "@/types/student";

interface StudentListProps {
  extended?: boolean;
  students?: Student[];
}

export const StudentList = ({ extended = false, students = [] }: StudentListProps) => {
  const getRiskBadge = (riskScore: number = 0) => {
    if (riskScore < 30) {
      return <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100 border-0">Low Risk</Badge>;
    } else if (riskScore < 70) {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0">Medium Risk</Badge>;
    } else {
      return <Badge variant="outline" className="bg-red-100 text-red-700 hover:bg-red-100 border-0">High Risk</Badge>;
    }
  };

  const getStatusBadge = (status: string = "offline") => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100 border-0">Active</Badge>;
      case "flagged":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0">Flagged</Badge>;
      case "high-risk":
        return <Badge variant="outline" className="bg-red-100 text-red-700 hover:bg-red-100 border-0">High Risk</Badge>;
      case "offline":
        return <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0">Offline</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0">Unknown</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Exam</TableHead>
          {extended && <TableHead>Status</TableHead>}
          <TableHead>Time Elapsed</TableHead>
          <TableHead>Risk Level</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.exam}</TableCell>
            {extended && <TableCell>{getStatusBadge(student.status)}</TableCell>}
            <TableCell>{student.timeElapsed || "00:00"}</TableCell>
            <TableCell>{getRiskBadge(student.riskScore)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};