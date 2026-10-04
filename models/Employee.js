import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      sparse: true
    },
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Employee email is required'],
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Employee password is required'],
      trim: true
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'employee'],
      default: 'employee'
    },
    department: {
      type: String,
      default: 'Front Desk & Reservations'
    },
    designation: {
      type: String,
      default: 'Telecalling Specialist'
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'On Leave'],
      default: 'Active'
    },
    avatar: {
      type: String,
      default: '💼'
    },
    dailyCallTarget: {
      type: Number,
      default: 35
    },
    dailyEmailTarget: {
      type: Number,
      default: 20
    }
  },
  {
    timestamps: true
  }
);

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
