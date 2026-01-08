import mongoose, { Document, Schema } from 'mongoose';
import { Student as IStudent } from '@/types/student';

// Extend the Student interface to include mongoose Document properties
export interface IStudentDocument extends Omit<IStudent, 'id'>, Document {
  studentId: string; // Use studentId instead of id to avoid conflict with mongoose _id
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  exam: { type: String, required: true },
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

export default mongoose.model<IStudentDocument>('Student', StudentSchema);