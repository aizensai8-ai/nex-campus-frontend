import mongoose from 'mongoose';

const cellSchema = new mongoose.Schema({
  time: { type: String, required: true },
  sub: { type: String, default: null }, // Null handles empty spans/placeholders
  note: { type: String, default: '' },
  type: { type: String, default: '' }, // 'break', 'lunch', etc.
  span: { type: Boolean, default: false }
}, { _id: false });

const TimetableSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  days: {
    Mon: [cellSchema],
    Tue: [cellSchema],
    Wed: [cellSchema],
    Thu: [cellSchema],
    Fri: [cellSchema],
    Sat: [cellSchema],
  },
  teachers: {
    type: Map,
    of: String,
    default: {}
  },
  meta: {
    room: { type: String, default: '' },
    classTeacher: { type: String, default: '' },
    proctor: { type: String, default: '' }
  }
}, { timestamps: true });

export default mongoose.model('Timetable', TimetableSchema);
