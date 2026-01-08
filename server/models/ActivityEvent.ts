import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityEvent extends Document {
  eventId: string;
  studentId: string;
  timestamp: Date;
  type: string;
  details?: string;
  riskScore: number;
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

export default mongoose.model<IActivityEvent>('ActivityEvent', ActivityEventSchema);