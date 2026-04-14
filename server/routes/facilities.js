import express from 'express';
import { body, validationResult } from 'express-validator';
import Facility from '../models/Facility.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// ── GET /api/facilities ───────────────────────────────────────────────────────
// Public. Supports: ?status=&type=&search=&page=&limit=
router.get(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { status, type, search, sort = 'name', page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (search) filter.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [facilities, total] = await Promise.all([
      Facility.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Facility.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: facilities,
    });
  })
);

// ── GET /api/facilities/:id ───────────────────────────────────────────────────
router.get(
  '/:id',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }
    res.status(200).json({ success: true, data: facility });
  })
);

// ── POST /api/facilities ──────────────────────────────────────────────────────
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Facility name is required'),
    body('type')
      .notEmpty()
      .isIn(['library', 'lab', 'gym', 'dining', 'auditorium', 'studio', 'center', 'canteen', 'sports', 'recreation', 'hostel', 'shop', 'other'])
      .withMessage('Valid facility type is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const facility = await Facility.create(req.body);
    res.status(201).json({ success: true, data: facility });
  })
);

// ── PUT /api/facilities/:id ───────────────────────────────────────────────────
router.put(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const facility = await Facility.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }

    res.status(200).json({ success: true, data: facility });
  })
);

// ── PATCH /api/facilities/:id/occupancy ───────────────────────────────────────
// Lightweight endpoint for IoT / live occupancy updates
router.patch(
  '/:id/occupancy',
  protect,
  authorize('admin', 'faculty'),
  asyncHandler(async (req, res) => {
    const { currentOccupancy } = req.body;

    if (currentOccupancy === undefined || typeof currentOccupancy !== 'number') {
      return res.status(400).json({ success: false, message: 'currentOccupancy (number) is required' });
    }

    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }

    facility.currentOccupancy = currentOccupancy;

    // Auto-update status based on occupancy
    if (facility.capacity) {
      const ratio = currentOccupancy / facility.capacity;
      if (ratio >= 0.9) facility.status = 'peak';
      else if (facility.status === 'peak') facility.status = 'open';
    }

    await facility.save();
    res.status(200).json({ success: true, data: facility });
  })
);

// ── DELETE /api/facilities/:id ────────────────────────────────────────────────
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }

    await facility.deleteOne();
    res.status(200).json({ success: true, message: 'Facility deleted' });
  })
);

export default router;
