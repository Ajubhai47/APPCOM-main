import express = require('express');
import { Request, Response } from 'express';
import Student, { IStudent } from '../models/Student';

const router = express.Router();

// Create a new student
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, exam, password } = req.body;

    const student = new Student({
      studentId: Date.now().toString(),
      name,
      exam,
      password: password || name, // Use provided password or fallback to name if not provided
      status: 'offline',
      timeElapsed: '00:00:00',
      riskScore: 0
    });

    const savedStudent = await student.save();

    res.status(201).json({
      id: savedStudent.studentId,
      name: savedStudent.name,
      exam: savedStudent.exam,
      status: savedStudent.status,
      timeElapsed: savedStudent.timeElapsed,
      riskScore: savedStudent.riskScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating student', error });
  }
});

// Get all students
router.get('/', async (req: Request, res: Response) => {
  try {
    const students = await Student.find({}).sort({ createdAt: -1 });

    const studentList = students.map(student => ({
      id: student.studentId,
      name: student.name,
      exam: student.exam,
      status: student.status,
      timeElapsed: student.timeElapsed,
      riskScore: student.riskScore
    }));

    res.json(studentList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error });
  }
});

// Get student by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const student = await Student.findOne({ studentId: req.params.id });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      id: student.studentId,
      name: student.name,
      exam: student.exam,
      status: student.status,
      timeElapsed: student.timeElapsed,
      riskScore: student.riskScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error });
  }
});

// Update student status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    // Fetch current student first to check existing status
    const currentStudent = await Student.findOne({ studentId: req.params.id });
    if (!currentStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Logic: Do not downgrade 'high-risk' or 'flagged' to 'active'
    // This assumes 'active' is the basic online state.
    // We allow 'offline' to override high-risk (maybe? or maybe not? user didn't specify, but offline usually means disconnected).
    // Let's stick to: If currently high-risk, ignore 'active'.

    let validStatus = status;
    if (status === 'active') {
      if (currentStudent.status === 'high-risk' || currentStudent.status === 'flagged') {
        console.log(`Ignoring status change to 'active' for flagged student ${currentStudent.name}`);
        validStatus = currentStudent.status; // Keep existing risk status
      }
    }

    const student = await Student.findOneAndUpdate(
      { studentId: req.params.id },
      { status: validStatus },
      { new: true }
    );

    res.json({
      id: student?.studentId,
      name: student?.name,
      exam: student?.exam,
      status: student?.status,
      timeElapsed: student?.timeElapsed,
      riskScore: student?.riskScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student status', error });
  }
});

// Update student risk score
router.patch('/:id/risk-score', async (req: Request, res: Response) => {
  try {
    const { riskScore } = req.body;

    // Determine status based on risk score
    let newStatus;
    if (riskScore >= 80) {
      newStatus = 'high-risk';
    } else if (riskScore >= 50) {
      newStatus = 'flagged';
    }
    // If < 50, we don't necessarily reset to 'active' because they might be 'offline' 
    // or we might want to keep history. But usually risk drops only if we explicitly allow it.
    // For now, let's only escalate status. If they were active and became risky, they change.

    const updateData: any = { riskScore };
    if (newStatus) {
      updateData.status = newStatus;
    }

    const student = await Student.findOneAndUpdate(
      { studentId: req.params.id },
      updateData,
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      id: student.studentId,
      name: student.name,
      exam: student.exam,
      status: student.status,
      timeElapsed: student.timeElapsed,
      riskScore: student.riskScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student risk score', error });
  }
});

// Update student time elapsed
router.patch('/:id/time-elapsed', async (req: Request, res: Response) => {
  try {
    const { timeElapsed } = req.body;

    const student = await Student.findOneAndUpdate(
      { studentId: req.params.id },
      { timeElapsed },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      id: student.studentId,
      name: student.name,
      exam: student.exam,
      status: student.status,
      timeElapsed: student.timeElapsed,
      riskScore: student.riskScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student time elapsed', error });
  }
});

// Verify student credentials
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body;

    // Verify student exists and password matches
    const student = await Student.findOne({ name });

    if (student && password === student.password) {
      console.log('Password match!');
      res.json({
        valid: true,
        studentId: student.studentId // Return ID for session management
      });
    } else {
      console.log('Verify failed. Mismatch or not found.');
      res.json({ valid: false });
    }
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Error verifying credentials', error });
  }
});

// Delete ALL students (Reset)
// Must be defined BEFORE /:id route to avoid being captured as an ID
router.delete('/reset/all', async (req: Request, res: Response) => {
  try {
    await Student.deleteMany({});
    res.json({ message: 'All students deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting all students', error });
  }
});

// Delete student
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const student = await Student.findOneAndDelete({ studentId: req.params.id });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error });
  }
});

export default router;