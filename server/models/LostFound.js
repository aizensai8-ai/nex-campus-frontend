import mongoose from 'mongoose';

const lostFoundSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['lost', 'found'], required: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    category: {
      type: String,
      enum: ['electronics', 'clothing', 'books', 'accessories', 'documents', 'keys', 'bags', 'other'],
      default: 'other',
    },
    location: { type: String, trim: true, maxlength: 100 },
    date: { type: Date, default: Date.now },
    description: { type: String, trim: true, maxlength: 500 },
    contact: { type: String, trim: true },
    imageUrl: { type: String, default: '' },
    postedBy: { type: String, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  },
  { timestamps: true }
);

lostFoundSchema.index({ type: 1, status: 1 });
lostFoundSchema.index({ category: 1 });
lostFoundSchema.index({ createdAt: -1 });

export default mongoose.model('LostFound', lostFoundSchema);
