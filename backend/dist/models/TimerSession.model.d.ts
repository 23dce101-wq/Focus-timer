import mongoose, { Document } from 'mongoose';
export interface ITimerSession extends Document {
    userId: mongoose.Types.ObjectId;
    mode: 'countdown' | 'pomodoro' | 'stopwatch';
    duration: number;
    timestamp: Date;
    createdAt: Date;
}
export declare const TimerSession: mongoose.Model<ITimerSession, {}, {}, {}, mongoose.Document<unknown, {}, ITimerSession, {}, {}> & ITimerSession & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=TimerSession.model.d.ts.map