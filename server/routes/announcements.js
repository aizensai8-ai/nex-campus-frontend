import express from 'express';
import { body, validationResult } from 'express-validator';
import Announcement from '../models/Announcement.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// ── GET /api/announcements ────────────────────────────────────────────────────
// Public. Supports: ?category=&priority=&pinned=&page=&limit=
router.get(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { category, priority, pinned, sort = '-pinned -createdAt', page = 1, limit = 20 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (pinned === 'true') filter.pinned = true;

    // Role-based filtering: non-admins only see announcements targeting their role or 'all'
    if (!req.user || req.user.role !== 'admin') {
      const role = req.user?.role || 'student';
      filter.$or = [{ targetRoles: 'all' }, { targetRoles: role }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [announcements, total] = await Promise.all([
      Announcement.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Announcement.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: announcements,
    });
  })
);

// ── GET /api/announcements/:id ────────────────────────────────────────────────
router.get(
  '/:id',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id).populate('author', 'name avatar role');
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.status(200).json({ success: true, data: announcement });
  })
);

// ── POST /api/announcements ───────────────────────────────────────────────────
router.post(
  '/',
  protect,
  authorize('admin', 'faculty'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('category')
      .optional()
      .isIn(['academic', 'events', 'facilities', 'general', 'urgent'])
      .withMessage('Invalid category'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),
    body('expiresAt').optional().isISO8601().withMessage('expiresAt must be a valid date'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    req.body.author = req.user._id;
    req.body.authorName = req.user.name;

    // Faculty can only post general/academic announcements
    if (req.user.role === 'faculty') {
      req.body.pinned = false;
      if (!['academic', 'general'].includes(req.body.category)) {
        req.body.category = 'general';
      }
    }

    const announcement = await Announcement.create(req.body);
    res.status(201).json({ success: true, data: announcement });
  })
);

// ── PUT /api/announcements/:id ────────────────────────────────────────────────
router.put(
  '/:id',
  protect,
  authorize('admin', 'faculty'),
  asyncHandler(async (req, res) => {
    let announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    // Faculty can only edit their own announcements
    if (req.user.role === 'faculty' && announcement.author?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this announcement' });
    }

    announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: announcement });
  })
);

// ── DELETE /api/announcements/:id ─────────────────────────────────────────────
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    await announcement.deleteOne();
    res.status(200).json({ success: true, message: 'Announcement deleted' });
  })
);

export default router;
