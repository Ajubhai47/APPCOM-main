import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  studentId: string;
  name: string;
  exam: string;
  password: string;
  timeElapsed: string;
  riskScore: number;
  status: 'active' | 'flagged' | 'high-risk' | 'offline';
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema({
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

export default mongoose.model<IStudent>('Student', StudentSchema);