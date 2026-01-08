import express = require('express');
import { Request, Response } from 'express';
import ActivityEvent, { IActivityEvent } from '../models/ActivityEvent';
import Student from '../models/Student';

const router = express.Router();

// Create a new activity event
router.post('/', async (req: Request, res: Response) => {
  try {
    const { studentId, timestamp, type, details, riskScore } = req.body;

    // Verify student exists
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const activityEvent = new ActivityEvent({
      eventId: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      studentId,
      timestamp: new Date(timestamp),
      type,
      details,
      riskScore
    });

    const savedEvent = await activityEvent.save();

    res.status(201).json({
      id: savedEvent.eventId,
      timestamp: savedEvent.timestamp,
      type: savedEvent.type,
      details: savedEvent.details,
      riskScore: savedEvent.riskScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating activity event', error });
  }
});

// Get activity events for a specific student
router.get('/student/:studentId', async (req: Request, res: Response) => {
  try {
    const events = await ActivityEvent.find({ studentId: req.params.studentId }).sort({ timestamp: -1 });

    const eventList = events.map(event => ({
      id: event.eventId,
      timestamp: event.timestamp,
      type: event.type,
      details: event.details,
      riskScore: event.riskScore
    }));

    res.json(eventList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity events', error });
  }
});

// Get all activity events with student information
router.get('/', async (req: Request, res: Response) => {
  try {
    const events = await ActivityEvent.find({}).sort({ timestamp: -1 }).limit(100);

    // Get student information for each event
    const studentIds = [...new Set(events.map(event => event.studentId))];
    const students = await Student.find({ studentId: { $in: studentIds } });
    const studentMap = new Map(students.map(student => [student.studentId, student]));

    const eventList = events.map(event => {
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

    res.json(eventList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all activity events', error });
  }
});

export default router;