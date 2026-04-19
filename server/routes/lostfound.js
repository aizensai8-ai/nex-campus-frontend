import express from 'express';
import LostFound from '../models/LostFound.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /api/lostfound — public, supports ?type=lost|found&status=active|resolved&category=X
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const { type, status, category, page = 1, limit = 30 } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (status) filter.status = status;
  if (category) filter.category = category;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [items, total] = await Promise.all([
    LostFound.find(filter).sort('-createdAt').skip(skip).limit(parseInt(limit)),
    LostFound.countDocuments(filter),
  ]);

  res.json({ success: true, total, data: items });
}));

// POST /api/lostfound — public (optionally linked to user)
router.post('/', optionalAuth, asyncHandler(async (req, res) => {
  const { type, title, category, location, date, description, contact, imageUrl, postedBy } = req.body;
  if (!type || !title) {
    return res.status(400).json({ success: false, message: 'type and title are required' });
  }

  const item = await LostFound.create({
    type, title, category, location, date, description, contact, imageUrl,
    postedBy: postedBy || req.user?.name || 'Anonymous',
    userId: req.user?._id || null,
  });

  res.status(201).json({ success: true, data: item });
}));

// PATCH /api/lostfound/:id/resolve — owner or admin
router.patch('/:id/resolve', protect, asyncHandler(async (req, res) => {
  const item = await LostFound.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

  const isOwner = item.userId && item.userId.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  item.status = 'resolved';
  await item.save();
  res.json({ success: true, data: item });
}));

// DELETE /api/lostfound/:id — owner or admin
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const item = await LostFound.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

  const isOwner = item.userId && item.userId.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  await item.deleteOne();
  res.json({ success: true, message: 'Deleted' });
}));

export default router;
