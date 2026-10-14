import mongoose from 'mongoose';

const lostFoundSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Lost', 'Found'],
      required: [true, 'Please specify type (Lost or Found)']
    },
    name: {
      type: String,
      required: [true, 'Please provide item name'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      enum: ['Electronics', 'Accessories', 'Keys', 'Clothing', 'Books', 'Other']
    },
    status: {
      type: String,
      enum: ['Open', 'Claimed'],
      default: 'Open'
    },
    location: {
      type: String,
      required: [true, 'Please provide location'],
      trim: true
    },
    date: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10)
    },
    description: {
      type: String,
      required: [true, 'Please provide item description']
    },
    contact: {
      type: String,
      default: 'Email'
    },
    image: {
      type: String,
      default: null
    },
    verified: {
      type: Boolean,
      default: false
    },
    reportedBy: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.LostFound || mongoose.model('LostFound', lostFoundSchema);
