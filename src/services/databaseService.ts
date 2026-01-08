import { Student } from '@/types/student';
import { ActivityEvent } from '@/types/activity';
import { connectToDatabase } from '@/config/db';
import StudentModel, { IStudentDocument } from '@/models/Student';
import ActivityEventModel, { IActivityEventDocument } from '@/models/ActivityEvent';

export class DatabaseService {
  // Initialize database connection
  static async initialize() {
    try {
      await connectToDatabase();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  // Student operations
  static async createStudent(studentData: Omit<Student, 'id' | 'status' | 'timeElapsed' | 'riskScore'>): Promise<Student> {
    try {
      const studentDoc = new StudentModel({
        studentId: Date.now().toString(),
        name: studentData.name,
        exam: studentData.exam,
        status: 'offline',
        timeElapsed: '00:00:00',
        riskScore: 0
      });

      const savedStudent = await studentDoc.save();
      
      return {
        id: savedStudent.studentId,
        name: savedStudent.name,
        exam: savedStudent.exam,
        status: savedStudent.status,
        timeElapsed: savedStudent.timeElapsed,
        riskScore: savedStudent.riskScore
      };
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  static async getAllStudents(): Promise<Student[]> {
    try {
      const students = await StudentModel.find({}).sort({ createdAt: -1 });
      
      return students.map(student => ({
        id: student.studentId,
        name: student.name,
        exam: student.exam,
        status: student.status,
        timeElapsed: student.timeElapsed,
        riskScore: student.riskScore
      }));
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  static async getStudentById(studentId: string): Promise<Student | null> {
    try {
      const student = await StudentModel.findOne({ studentId });
      
      if (!student) return null;
      
      return {
        id: student.studentId,
        name: student.name,
        exam: student.exam,
        status: student.status,
        timeElapsed: student.timeElapsed,
        riskScore: student.riskScore
      };
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  }

  static async updateStudentStatus(studentId: string, status: 'active' | 'flagged' | 'high-risk' | 'offline'): Promise<Student | null> {
    try {
      const updatedStudent = await StudentModel.findOneAndUpdate(
        { studentId },
        { status },
        { new: true }
      );
      
      if (!updatedStudent) return null;
      
      return {
        id: updatedStudent.studentId,
        name: updatedStudent.name,
        exam: updatedStudent.exam,
        status: updatedStudent.status,
        timeElapsed: updatedStudent.timeElapsed,
        riskScore: updatedStudent.riskScore
      };
    } catch (error) {
      console.error('Error updating student status:', error);
      throw error;
    }
  }

  static async updateStudentRiskScore(studentId: string, riskScore: number): Promise<Student | null> {
    try {
      const updatedStudent = await StudentModel.findOneAndUpdate(
        { studentId },
        { riskScore },
        { new: true }
      );
      
      if (!updatedStudent) return null;
      
      return {
        id: updatedStudent.studentId,
        name: updatedStudent.name,
        exam: updatedStudent.exam,
        status: updatedStudent.status,
        timeElapsed: updatedStudent.timeElapsed,
        riskScore: updatedStudent.riskScore
      };
    } catch (error) {
      console.error('Error updating student risk score:', error);
      throw error;
    }
  }

  // Activity Event operations
  static async createActivityEvent(eventData: Omit<ActivityEvent, 'id'> & { studentId: string }): Promise<ActivityEvent> {
    try {
      const eventDoc = new ActivityEventModel({
        eventId: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        studentId: eventData.studentId,
        timestamp: eventData.timestamp,
        type: eventData.type,
        details: eventData.details,
        riskScore: eventData.riskScore
      });

      const savedEvent = await eventDoc.save();
      
      return {
        id: savedEvent.eventId,
        timestamp: savedEvent.timestamp,
        type: savedEvent.type,
        details: savedEvent.details,
        riskScore: savedEvent.riskScore
      };
    } catch (error) {
      console.error('Error creating activity event:', error);
      throw error;
    }
  }

  static async getStudentActivityEvents(studentId: string): Promise<ActivityEvent[]> {
    try {
      const events = await ActivityEventModel.find({ studentId }).sort({ timestamp: -1 });
      
      return events.map(event => ({
        id: event.eventId,
        timestamp: event.timestamp,
        type: event.type,
        details: event.details,
        riskScore: event.riskScore
      }));
    } catch (error) {
      console.error('Error fetching student activity events:', error);
      throw error;
    }
  }

  static async getAllActivityEvents(): Promise<(ActivityEvent & { studentName: string, exam: string })[]> {
    try {
      const events = await ActivityEventModel.find({}).sort({ timestamp: -1 }).limit(100);
      
      // Get student information for each event
      const studentIds = [...new Set(events.map(event => event.studentId))];
      const students = await StudentModel.find({ studentId: { $in: studentIds } });
      const studentMap = new Map(students.map(student => [student.studentId, student]));
      
      return events.map(event => {
        const student = studentMap.get(event.studentId);
        return {
          id: event.eventId,
          timestamp: event.timestamp,
          type: event.type,
          details: event.details,
          riskScore: event.riskScore,
          studentName: student ? student.name : 'Unknown',
          exam: student ? student.exam : 'Unknown'
        };
      });
    } catch (error) {
      console.error('Error fetching all activity events:', error);
      throw error;
    }
  }

  // Authentication operations
  static async verifyStudentCredentials(studentId: string, password: string): Promise<boolean> {
    try {
      // In a real implementation, you would have a separate authentication system
      // For this demo, we'll just check if the student exists and the password matches the studentId
      const student = await StudentModel.findOne({ studentId });
      return !!student && password === studentId;
    } catch (error) {
      console.error('Error verifying student credentials:', error);
      return false;
    }
  }
}