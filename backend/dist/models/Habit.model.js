"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Habit = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const habitDaySchema = new mongoose_1.Schema({
    date: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['done', 'missed', 'pending'],
        default: 'pending',
    },
}, { _id: false });
const habitSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
// Ensure we return a clean JSON shape to the client
habitSchema.set('toJSON', {
    transform: (_doc, ret) => {
        const r = ret;
        r.id = r.habitId;
        delete r._id;
        delete r.__v;
        delete r.habitId;
        return r;
    },
});
habitSchema.index({ userId: 1, habitId: 1 }, { unique: true });
exports.Habit = mongoose_1.default.model('Habit', habitSchema);
//# sourceMappingURL=Habit.model.js.map