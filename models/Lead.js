import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      sparse: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      trim: true,
      default: ''
    },
    preferredMethod: {
      type: String,
      default: 'Phone'
    },
    source: {
      type: String,
      default: 'Website Booking Form'
    },
    message: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Site Visit Scheduled', 'Negotiation', 'Converted', 'Confirmed', 'Cancelled', 'Follow Up', 'Lost'],
      default: 'New'
    },
    unitInterest: {
      type: String,
      default: 'Any Room / Best Available'
    },
    checkIn: {
      type: String,
      default: ''
    },
    checkOut: {
      type: String,
      default: ''
    },
    budget: {
      type: String,
      default: ''
    },
    assignedToId: {
      type: String,
      default: ''
    },
    assignedToName: {
      type: String,
      default: 'Unassigned'
    },
    assignedTo: {
      type: String,
      default: ''
    },
    assignedEmployeeName: {
      type: String,
      default: 'Unassigned'
    },
    notes: {
      type: String,
      default: ''
    },
    followUpDate: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
