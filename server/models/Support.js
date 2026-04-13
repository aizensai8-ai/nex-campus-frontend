import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], lowercase: true, trim: true },
    phone: { type: String, trim: true },
    usn: { type: String, lowercase: true, trim: true },
    message: { type: String, required: [true, 'Message is required'], trim: true },
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  },
  { timestamps: true }
);

supportSchema.index({ status: 1 });
supportSchema.index({ createdAt: -1 });

export default mongoose.model('Support', supportSchema);
