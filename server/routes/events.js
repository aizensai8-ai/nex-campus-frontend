import express from 'express';
import { body, validationResult } from 'express-validator';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// ── GET /api/events ───────────────────────────────────────────────────────────
// Public. Supports: ?category=&status=&featured=&from=&to=&search=&page=&limit=&sort=
router.get(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const {
      category,
      status,
      featured,
      from,
      to,
      search,
      sort = 'date',
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (featured === 'true') filter.featured = true;
    if (search) filter.$text = { $search: search };

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [events, total] = await Promise.all([
      Event.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Event.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: events,
    });
  })
);

// ── GET /api/events/:id ───────────────────────────────────────────────────────
router.get(
  '/:id',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id).populate('attendees', 'name avatar');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, data: event });
  })
);

// ── POST /api/events ──────────────────────────────────────────────────────────
router.post(
  '/',
  protect,
  authorize('admin', 'faculty'),
  [
    body('title').trim().notEmpty().withMessage('Event title is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('category')
      .optional()
      .isIn(['keynote', 'hackathon', 'workshop', 'symposium', 'networking', 'open-house', 'sports', 'cultural', 'academic', 'other'])
      .withMessage('Invalid category'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    req.body.organizerRef = req.user._id;
    if (!req.body.organizer) req.body.organizer = req.user.name;

    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event });
  })
);

// ── PUT /api/events/:id ───────────────────────────────────────────────────────
router.put(
  '/:id',
  protect,
  authorize('admin', 'faculty'),
  asyncHandler(async (req, res) => {
    delete req.body.attendees; // Attendees managed via /register endpoints

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, data: event });
  })
);

// ── DELETE /api/events/:id ────────────────────────────────────────────────────
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await event.deleteOne();
    res.status(200).json({ success: true, message: 'Event deleted' });
  })
);

// ── POST /api/events/:id/register ─────────────────────────────────────────────
router.post(
  '/:id/register',
  protect,
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.status === 'past' || event.status === 'cancelled') {
      return res.status(400).json({ success: false, message: `Cannot register for a ${event.status} event` });
    }

    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Already registered for this event' });
    }

    if (event.capacity && event.attendees.length >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Event is at full capacity' });
    }

    event.attendees.push(req.user._id);

    // Auto-set waitlist status when near capacity
    if (event.capacity && event.attendees.length >= event.capacity) {
      event.status = 'waitlist';
    }

    await event.save();

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { registeredEvents: event._id },
    });

    res.status(200).json({
      success: true,
      message: 'Registered successfully',
      attendeeCount: event.attendees.length,
    });
  })
);

// ── GET /api/events/:id/participants  (admin only) ───────────────────────────
router.get(
  '/:id/participants',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
      .populate('attendees', 'name email usn section');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, data: event.attendees });
  })
);

// ── DELETE /api/events/:id/register ──────────────────────────────────────────
router.delete(
  '/:id/register',
  protect,
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!event.attendees.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Not registered for this event' });
    }

    event.attendees = event.attendees.filter((id) => id.toString() !== req.user._id.toString());

    // Restore status if below capacity
    if (event.status === 'waitlist' && event.capacity && event.attendees.length < event.capacity) {
      event.status = 'upcoming';
    }

    await event.save();

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { registeredEvents: event._id },
    });

    res.status(200).json({ success: true, message: 'Registration cancelled' });
  })
);

export default router;
