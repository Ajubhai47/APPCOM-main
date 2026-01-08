const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ethicproctor';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Student Schema
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  exam: { type: String, required: true },
  password: { type: String, required: true },
  timeElapsed: { type: String, default: '00:00:00' },
  riskScore: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['active', 'flagged', 'high-risk', 'offline'],
    default: 'offline'
  }
}, {
  timestamps: true
});

// Activity Event Schema
const activityEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  studentId: { type: String, required: true, index: true },
  timestamp: { type: Date, required: true },
  type: { type: String, required: true },
  details: { type: String },
  riskScore: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Add indexes for better query performance
activityEventSchema.index({ studentId: 1, timestamp: -1 });

const Student = mongoose.model('Student', studentSchema);
const ActivityEvent = mongoose.model('ActivityEvent', activityEventSchema);

// Routes
// Create a new student
app.post('/api/students', async (req, res) => {
  try {
    const { name, exam } = req.body;
    
    const student = new Student({
      studentId: Date.now().toString(),
      name,
      exam,
      password: name, // Password is same as student name by default
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
app.get('/api/students', async (req, res) => {
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
app.get('/api/students/:id', async (req, res) => {
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
app.patch('/api/students/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const student = await Student.findOneAndUpdate(
      { studentId: req.params.id },
      { status },
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
    res.status(500).json({ message: 'Error updating student status', error });
  }
});

// Update student risk score
app.patch('/api/students/:id/risk-score', async (req, res) => {
  try {
    const { riskScore } = req.body;
    
    const student = await Student.findOneAndUpdate(
      { studentId: req.params.id },
      { riskScore },
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

// Verify student credentials
app.post('/api/students/verify', async (req, res) => {
  try {
    const { studentId, password } = req.body;
    
    // Verify student exists and password matches
    const student = await Student.findOne({ studentId });
    
    if (student && password === student.password) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying credentials', error });
  }
});

// Create a new activity event
app.post('/api/activities', async (req, res) => {
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
app.get('/api/activities/student/:studentId', async (req, res) => {
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
app.get('/api/activities', async (req, res) => {
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;