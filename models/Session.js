import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    employeeId: {
      type: String,
      required: true,
      index: true
    },
    employeeEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    employeeName: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      default: 'employee'
    },
    loginTime: {
      type: Date,
      default: Date.now
    },
    logoutTime: {
      type: Date,
      default: null
    },
    lastHeartbeat: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    activeScreenSeconds: {
      type: Number,
      default: 0
    },
    idleSeconds: {
      type: Number,
      default: 0
    },
    totalSeconds: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'LOGGED_OUT'],
      default: 'ACTIVE'
    }
  },
  {
    timestamps: true
  }
);

const Session = mongoose.model('Session', sessionSchema);
export default Session;
