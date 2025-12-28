import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    password?: string;
    name: string;
    avatar?: string;
    provider: 'email' | 'google';
    googleId?: string;
    settings?: {
        theme?: 'light' | 'dark' | 'system';
        notifications?: boolean;
        soundEnabled?: boolean;
        defaultTimerMode?: 'countdown' | 'pomodoro' | 'stopwatch';
    };
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    refreshTokens: string[];
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.model.d.ts.map