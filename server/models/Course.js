import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Course code is required'],
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    instructor: {
      type: String,
      required: [true, 'Instructor name is required'],
    },
    instructorAvatar: {
      type: String,
      default: '',
    },
    schedule: {
      type: String, // e.g. "MWF 10:00 AM"
    },
    credits: {
      type: Number,
      required: [true, 'Credits are required'],
      min: [0, 'Credits cannot be negative'],
      max: [20, 'Credits cannot exceed 20'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: [
        'Computer Science',
        'Data Science',
        'Artificial Intelligence',
        'Physics & Math',
        'Creative Technology',
        'Engineering',
        'Business',
        'General',
        'Other',
      ],
    },
    level: {
      type: Number,
      min: 100,
      max: 900,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    enrolled: {
      type: Number,
      default: 0,
    },
    capacity: {
      type: Number,
      default: 30,
    },
    tags: [String],
    status: {
      type: String,
      enum: ['active', 'new', 'popular', 'archived'],
      default: 'active',
    },
    totalClasses: {
      type: Number,
      default: 0,
      min: 0,
    },
    section: {
      type: String,
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtual: seats remaining ──────────────────────────────────────────────────
courseSchema.virtual('seatsRemaining').get(function () {
  return this.capacity - this.enrolled;
});

// ── Indexes ───────────────────────────────────────────────────────────────────
courseSchema.index({ code: 1, section: 1 }, { unique: true });
courseSchema.index({ department: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ name: 'text', description: 'text', instructor: 'text' });

export default mongoose.model('Course', courseSchema);
