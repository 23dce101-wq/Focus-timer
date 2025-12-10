import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

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

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
    },
    provider: {
      type: String,
      enum: ['email', 'google'],
      default: 'email',
    },
    googleId: {
      type: String,
      sparse: true,
    },
    settings: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      soundEnabled: {
        type: Boolean,
        default: true,
      },
      defaultTimerMode: {
        type: String,
        enum: ['countdown', 'pomodoro', 'stopwatch'],
        default: 'countdown',
      },
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    refreshTokens: [String],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// Don't return password in JSON
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    const r: any = ret;
    delete r.password;
    delete r.refreshTokens;
    delete r.passwordResetToken;
    delete r.passwordResetExpires;
    delete r.__v;
    return r;
  },
});

export const User = mongoose.model<IUser>('User', userSchema);
