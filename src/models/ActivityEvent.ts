import mongoose, { Document, Schema } from 'mongoose';
import { ActivityEvent as IActivityEvent } from '@/types/activity';

export interface IActivityEventDocument extends Omit<IActivityEvent, 'id' | 'timestamp'>, Document {
  eventId: string;
  studentId: string; // Reference to the student
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityEventSchema: Schema = new Schema({
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
ActivityEventSchema.index({ studentId: 1, timestamp: -1 });

export default mongoose.model<IActivityEventDocument>('ActivityEvent', ActivityEventSchema);