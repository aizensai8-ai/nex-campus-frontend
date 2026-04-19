import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], lowercase: true, trim: true },
    phone: { type: String, trim: true },
    usn: { type: String, lowercase: true, trim: true },
    message: { type: String, required: [true, 'Message is required'], trim: true },
    category: {
      type: String,
      enum: ['portal', 'attendance', 'library', 'facility', 'academics', 'technical', 'other'],
      default: 'other',
    },
    priority: { type: String, enum: ['low', 'normal', 'high', 'critical'], default: 'normal' },
    status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
    adminReply: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

supportSchema.index({ status: 1 });
supportSchema.index({ email: 1 });
supportSchema.index({ userId: 1 });
supportSchema.index({ createdAt: -1 });

export default mongoose.model('Support', supportSchema);
