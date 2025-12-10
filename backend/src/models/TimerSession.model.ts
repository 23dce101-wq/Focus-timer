import mongoose, { Document, Schema } from 'mongoose';

export interface ITimerSession extends Document {
  userId: mongoose.Types.ObjectId;
  mode: 'countdown' | 'pomodoro' | 'stopwatch';
  duration: number; // in seconds
  timestamp: Date;
  createdAt: Date;
}

const timerSessionSchema = new Schema<ITimerSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mode: {
      type: String,
      enum: ['countdown', 'pomodoro', 'stopwatch'],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound index for efficient querying
timerSessionSchema.index({ userId: 1, timestamp: -1 });
timerSessionSchema.index({ userId: 1, mode: 1, timestamp: -1 });

export const TimerSession = mongoose.model<ITimerSession>('TimerSession', timerSessionSchema);
