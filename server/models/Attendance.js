import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent'],
      default: 'absent',
    },
  },
  { timestamps: true }
);

// One record per user per course per date
attendanceSchema.index({ user: 1, course: 1, date: 1 }, { unique: true });
attendanceSchema.index({ user: 1, course: 1 });
attendanceSchema.index({ course: 1, date: 1 });

export default mongoose.model('Attendance', attendanceSchema);
