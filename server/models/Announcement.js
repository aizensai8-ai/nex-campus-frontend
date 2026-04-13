import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Announcement title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Announcement content is required'],
    },
    category: {
      type: String,
      enum: ['academic', 'events', 'facilities', 'general', 'urgent'],
      default: 'general',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Denormalized so announcements survive user deletions
    authorName: {
      type: String,
      default: 'Nex Campus Admin',
    },
    expiresAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    targetRoles: {
      type: [String],
      enum: ['student', 'faculty', 'admin', 'all'],
      default: ['all'],
    },
  },
  {
    timestamps: true,
  }
);

// ── Auto-deactivate expired announcements ─────────────────────────────────────
announcementSchema.pre(/^find/, function (next) {
  // Skip expiry filter when explicitly querying expired items (admin)
  if (!this._skipExpiryFilter) {
    const now = new Date();
    this.where({
      isActive: true,
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: now } }],
    });
  }
  next();
});

// ── Indexes ───────────────────────────────────────────────────────────────────
announcementSchema.index({ category: 1 });
announcementSchema.index({ priority: -1 });
announcementSchema.index({ pinned: -1, createdAt: -1 });
announcementSchema.index({ isActive: 1, expiresAt: 1 });

export default mongoose.model('Announcement', announcementSchema);
