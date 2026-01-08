const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ethicproctor';

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

console.log('Attempting to connect to MongoDB...');

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB Atlas');
    
    // Check if student already exists
    const existingStudent = await Student.findOne({ name: 'Muzzamil', exam: 'C' });
    
    if (existingStudent) {
      console.log(`Student "Muzzamil" already exists with ID: ${existingStudent.studentId}`);
      mongoose.connection.close();
      return;
    }
    
    // Create student data
    const studentId = Date.now().toString();
    const studentData = {
      studentId: studentId,
      name: "Muzzamil",
      exam: "C",
      password: "Muzzamil", // Password is same as student name
      status: "offline",
      timeElapsed: "00:00:00",
      riskScore: 0
    };
    
    // Save student data to MongoDB
    const student = new Student(studentData);
    await student.save();
    
    console.log(`Student "${studentData.name}" with ID ${studentId} has been added successfully to MongoDB.`);
    console.log(`Exam: ${studentData.exam}`);
    console.log(`Password: ${studentData.password}`);
    
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });