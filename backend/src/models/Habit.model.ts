import mongoose, { Document, Schema } from 'mongoose';

export interface IHabitDay {
  date: string; // YYYY-MM-DD
  status: 'done' | 'missed' | 'pending';
}

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;
  habitId: string;
  name: string;
  icon: string;
  category: string;
  dailyTarget: number;
  reminderEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  days: IHabitDay[];
}

const habitDaySchema = new Schema<IHabitDay>(
  {
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['done', 'missed', 'pending'],
      default: 'pending',
    },
  },
  { _id: false }
);

const habitSchema = new Schema<IHabit>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    habitId: {
      type: String,
      index: true,
      default: () => `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    dailyTarget: {
      type: Number,
      default: 1,
      min: 1,
    },
    reminderEnabled: {
      type: Boolean,
      default: false,
    },
    days: {
      type: [habitDaySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure we return a clean JSON shape to the client
habitSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const r: any = ret;
    r.id = r.habitId;
    delete r._id;
    delete r.__v;
    delete r.habitId;
    return r;
  },
});

habitSchema.index({ userId: 1, habitId: 1 }, { unique: true });

export const Habit = mongoose.model<IHabit>('Habit', habitSchema);
