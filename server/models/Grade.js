import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  cie1: { type: Number, default: 0 },
  cie2: { type: Number, default: 0 },
  cie3: { type: Number, default: 0 },
  maxCie: { type: Number, default: 50 },
  totalMarks: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Grade', gradeSchema);
