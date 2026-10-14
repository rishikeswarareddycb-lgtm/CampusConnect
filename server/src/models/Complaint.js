import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Infrastructure', 'Electricity', 'Water', 'Cleanliness', 'Internet', 'Other']
    },
    status: {
      type: String,
      enum: ['Submitted', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Submitted'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    location: {
      type: String,
      required: [true, 'Please provide location'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a description']
    },
    image: {
      type: String,
      default: null
    },
    student: {
      type: String,
      required: true
    },
    studentEmail: {
      type: String,
      required: true
    },
    date: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10)
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
