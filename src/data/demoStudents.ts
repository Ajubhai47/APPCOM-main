import { Student } from '@/types/student';

// Demo student data for demonstration purposes
export const demoStudents: Student[] = [
  {
    id: '1762414801543',
    name: 'Muzzamil',
    exam: 'C',
    password: 'Muzzamil',
    status: 'offline',
    timeElapsed: '00:00:00',
    riskScore: 0
  }
];

// Additional demo students for a more complete demonstration
export const additionalDemoStudents: Student[] = [
  {
    id: '1762414801544',
    name: 'John Doe',
    exam: 'Mathematics',
    password: 'JohnDoe',
    status: 'offline',
    timeElapsed: '00:00:00',
    riskScore: 0
  },
  {
    id: '1762414801545',
    name: 'Jane Smith',
    exam: 'Physics',
    password: 'JaneSmith',
    status: 'offline',
    timeElapsed: '00:00:00',
    riskScore: 0
  },
  {
    id: '1762414801546',
    name: 'Robert Johnson',
    exam: 'Chemistry',
    password: 'RobertJohnson',
    status: 'offline',
    timeElapsed: '00:00:00',
    riskScore: 0
  }
];

// All demo students combined
export const allDemoStudents: Student[] = [...demoStudents, ...additionalDemoStudents];

// Function to get a student by ID
export const getDemoStudentById = (id: string): Student | undefined => {
  return allDemoStudents.find(student => student.id === id);
};

// Function to verify student credentials
export const verifyDemoStudentCredentials = (studentId: string, password: string): boolean => {
  const student = allDemoStudents.find(s => s.id === studentId);
  return !!student && student.password === password;
};

// Function to add a new demo student
export const addDemoStudent = (studentData: Omit<Student, 'id' | 'status' | 'timeElapsed' | 'riskScore' | 'password'>): Student => {
  const newStudent: Student = {
    id: Date.now().toString(),
    ...studentData,
    password: studentData.name.replace(/\s+/g, ''), // Simple password generation
    status: 'offline',
    timeElapsed: '00:00:00',
    riskScore: 0
  };
  
  allDemoStudents.push(newStudent);
  return newStudent;
};