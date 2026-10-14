import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      enum: ['Technical', 'Cultural', 'Sports', 'Workshops']
    },
    date: {
      type: String,
      required: [true, 'Please provide event date']
    },
    venue: {
      type: String,
      required: [true, 'Please provide event venue']
    },
    organizer: {
      type: String,
      required: [true, 'Please provide organizer']
    },
    seats: {
      type: Number,
      required: true,
      default: 100
    },
    taken: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      default: ''
    },
    registeredEmails: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
