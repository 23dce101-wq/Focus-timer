import mongoose, { Document } from 'mongoose';
export interface IHabitDay {
    date: string;
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
export declare const Habit: mongoose.Model<IHabit, {}, {}, {}, mongoose.Document<unknown, {}, IHabit, {}, {}> & IHabit & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Habit.model.d.ts.map