import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String, // e.g. "14:00"
    },
    endTime: {
      type: String, // e.g. "17:30"
    },
    location: {
      type: String,
    },
    category: {
      type: String,
      enum: ['keynote', 'hackathon', 'workshop', 'symposium', 'networking', 'open-house', 'sports', 'cultural', 'academic', 'other'],
      default: 'other',
    },
    capacity: {
      type: Number,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'past', 'cancelled', 'waitlist'],
      default: 'upcoming',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    organizer: {
      type: String,
    },
    organizerRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtual: attendee count ───────────────────────────────────────────────────
eventSchema.virtual('attendeeCount').get(function () {
  return this.attendees.length;
});

// ── Virtual: seats remaining ──────────────────────────────────────────────────
eventSchema.virtual('seatsRemaining').get(function () {
  if (!this.capacity) return null;
  return this.capacity - this.attendees.length;
});

// ── Indexes ───────────────────────────────────────────────────────────────────
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ featured: -1, date: 1 });
eventSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Event', eventSchema);
