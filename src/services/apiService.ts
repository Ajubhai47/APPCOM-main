import { Student } from '@/types/student';
import { ActivityEvent } from '@/types/activity';

const API_BASE_URL = '/api';

export class ApiService {
  // Student operations
  static async createStudent(studentData: Omit<Student, 'id' | 'status' | 'timeElapsed' | 'riskScore'>): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      throw new Error('Failed to create student');
    }

    const student = await response.json();
    return {
      ...student,
      id: student.studentId
    };
  }

  static async getAllStudents(): Promise<Student[]> {
    const response = await fetch(`${API_BASE_URL}/students`);

    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }

    const students = await response.json();
    return students.map((student: any) => ({
      ...student,
      id: student.studentId // Map backend specific studentId to frontend id
    }));
  }

  static async getStudentById(studentId: string): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch student');
    }

    return await response.json();
  }

  static async updateStudentStatus(studentId: string, status: 'active' | 'flagged' | 'high-risk' | 'offline'): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update student status');
    }

    return await response.json();
  }

  static async updateStudentRiskScore(studentId: string, riskScore: number): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/risk-score`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ riskScore }),
    });

    if (!response.ok) {
      throw new Error('Failed to update student risk score');
    }
    return await response.json();
  }

  static async updateStudentTimeElapsed(studentId: string, timeElapsed: string): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/time-elapsed`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ timeElapsed }),
    });

    if (!response.ok) {
      throw new Error('Failed to update student time elapsed');
    }

    return await response.json();
  }

  // Activity Event operations
  static async createActivityEvent(eventData: {
    studentId: string;
    timestamp: Date | string;
    type: string;
    details?: string;
    riskScore: number
  }): Promise<ActivityEvent> {
    const response = await fetch(`${API_BASE_URL}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error('Failed to create activity event');
    }

    return await response.json();
  }

  static async getStudentActivityEvents(studentId: string): Promise<ActivityEvent[]> {
    const response = await fetch(`${API_BASE_URL}/activities/student/${studentId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch student activity events');
    }

    return await response.json();
  }

  static async getAllActivityEvents(): Promise<(ActivityEvent & { studentName: string, exam: string })[]> {
    const response = await fetch(`${API_BASE_URL}/activities`);

    if (!response.ok) {
      throw new Error('Failed to fetch all activity events');
    }

    const events = await response.json();
    return events.map((event: any) => ({
      ...event,
      timestamp: new Date(event.timestamp)
    }));
  }

  // Authentication operations
  static async verifyStudentCredentials(name: string, password: string): Promise<{ valid: boolean, studentId?: string }> {
    const response = await fetch(`${API_BASE_URL}/students/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify credentials');
    }

    return await response.json();
  }
}