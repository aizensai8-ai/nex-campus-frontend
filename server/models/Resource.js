import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Syllabus', 'Notes', 'PYQ', 'Calendar', 'Other'],
    default: 'Notes'
  },
  semester: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8],
    required: true
  },
  branch: {
    type: String,
    default: 'CSE'
  },
  url: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);
