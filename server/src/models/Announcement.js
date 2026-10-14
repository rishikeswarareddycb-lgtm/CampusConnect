import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide announcement title'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      default: 'General'
    },
    date: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10)
    },
    pinned: {
      type: Boolean,
      default: false
    },
    body: {
      type: String,
      required: [true, 'Please provide announcement content']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
