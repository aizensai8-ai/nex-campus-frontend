import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Facility name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
    },
    hours: {
      type: String, // e.g. "08:00 — 22:00"
    },
    capacity: {
      type: Number,
    },
    currentOccupancy: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'reserved', 'maintenance', 'peak'],
      default: 'open',
    },
    type: {
      type: String,
      enum: ['library', 'lab', 'gym', 'dining', 'auditorium', 'studio', 'center', 'canteen', 'sports', 'recreation', 'hostel', 'shop', 'other'],
      required: [true, 'Facility type is required'],
    },
    image: {
      type: String,
      default: '',
    },
    amenities: [String],
    bookingRequired: {
      type: Boolean,
      default: false,
    },
    accessLevel: {
      type: String,
      enum: ['open', 'student', 'faculty', 'reserved'],
      default: 'open',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    menuItems: [
      {
        name: { type: String },
        price: { type: Number },
        description: { type: String },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtual: occupancy percentage ─────────────────────────────────────────────
facilitySchema.virtual('occupancyPercent').get(function () {
  if (!this.capacity || this.capacity === 0) return null;
  return Math.round((this.currentOccupancy / this.capacity) * 100);
});

// ── Indexes ───────────────────────────────────────────────────────────────────
facilitySchema.index({ status: 1 });
facilitySchema.index({ type: 1 });
facilitySchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Facility', facilitySchema);
